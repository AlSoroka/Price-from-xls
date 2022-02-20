import xlrd
import re
import time
import ftplib
import shutil
import datetime
import os

# Копируем и передаем на сервер фалй прайса
# Создаем новое имя для прайса, который скопируем на сервер. Оно включает дату
now = str(datetime.datetime.now())
den=now[8:10]
mes=now[5:7]
god=now[:4]

new_name='Price Energopress TNPA '+den+'-'+mes+'-'+god+'.xls'
new_nameJ='Price Energopress Journals '+den+'-'+mes+'-'+god+'.xls'
#path=r'\\Buh\подписка\Прайсы'
path=r'price'
price=r'Price Energopress TNPA 21-01-2022.xls'

#Создаем HTML страницу из файла прайса

#fp = open(os.path.join(path,'Прайс для сайта.html'), 'w')

fp = open('index.html', 'w', encoding="utf-8")

nazvanie=' '
postanovlenie=' '
cena="0.00"
kol='  '
idList=''






# Записываем дату обновления

#Создаем заголовок таблицы


with open ('part1.html', 'r', encoding="utf-8") as fl:
    part1=fl.read()

part1=re.sub('{{Price}}','/price/'+price, part1)


fp.write(part1)





#Открываем файл Прайс.xls
rbook = xlrd.open_workbook(os.path.join(path,price))
# Получаем доступ к листу
rsheet=rbook.sheet_by_index(0)
i=0
for str_num in range(14,rsheet.nrows):
    i+=1
    print(i)
#Создаем тело таблицы
    razdel=str(rsheet.cell(str_num,0).value)
    hpl_z=rsheet.hyperlink_map.get((str_num,0))
    url_cell=str(rsheet.cell(str_num,0).value)
    url_z = '(No URL)' if hpl_z is None else hpl_z.url_or_path



    #psevdo=str(rsheet.cell(str_num,15).value).strip()
    psevdo=''
    npp=str(rsheet.cell(str_num,1).value)
    nazvanie=str(rsheet.cell(str_num,2).value)
    hpl=rsheet.hyperlink_map.get((str_num,3))
    url_cell=str(rsheet.cell(str_num,3).value)
    url = '(No URL)' if hpl is None else hpl.url_or_path
       # Заменяем разрывы строк внутри ячеек на <br>
    nazvanie=re.sub('[\r\n]','<br>', nazvanie)

    # После предлогов ставим неразрывный пробел
    #nazvanie=re.sub('(\s[а-я]{1,3})\s',r'\1&nbsp;' , nazvanie)
    # После предлогов, стоящих перед кавычками ставим неразрывный пробел
    #nazvanie=re.sub('(["|«|(][а-я,А-Я]{1,3})\s',r'\1&nbsp;' , nazvanie)
    nazvanie=re.sub('^Сборник','<b>СБОРНИК</b>', nazvanie)
    nazvanie=re.sub('^СБОРНИК','<b>СБОРНИК</b>', nazvanie)
    postanovlenie=str(rsheet.cell(str_num,4).value)
    #postanovlenie=postanovlenie.replace('°','&nbsp;')
    # Заменяем разрывы строк внутри ячеек на <br>
    postanovlenie=re.sub('[\r\n]','<br>', postanovlenie)
    # После предлогов ставим неразрывный пробел
    #postanovlenie=re.sub('(\s[а-я]{1,3})\s',r'\1&nbsp;' , postanovlenie)
    # Если внутри есть 2018 или 2019 окрашиваем его жирным черным
    #postanovlenie=postanovlenie.replace('2018','<span style="color: black; font-size:120%"><b>2018</b></span> ')
    #postanovlenie=postanovlenie.replace('2019','<span style="color: black; font-size:120%"><b>2019</b></span> ')

    cena=str(rsheet.cell(str_num,5).value).strip()
    cena=re.sub('[\r\n]', '', cena)


    # Формируем цену с двумя знаками после запятой: чтобы не округляло 14.80 в 14.8
    if len(cena)>0:
        if cena[0].isdigit():
            #преобразуем в плавающее
            #cena =  float(rsheet.cell(str_num,4).value)
            cena =  float(cena)
            #преобразуем в форма два знака до, два после запятой
            cena="%3.2f" % (cena)

        cena=cena.replace(',','.')

    #schet='<a href="_files/'+psevdo+'_schet.pdf" download>Скачать счет</a>'
    count='<input id="count_'+npp+'" type="text" value="" \
            title="Введите необходимое Вам количество экз." style="width:75%; text-align:center ">\n'\
             # onchange="sum_calculate(this.value)


    if nazvanie=='Название':
        continue
    if not razdel.strip() and not nazvanie.strip():
         continue
    if razdel.strip():
        if razdel.find('НОВЫЕ')>-1:
            fp.write('<tr><th colspan="7" align="center" style="color:red;">'+razdel+'</th></tr>\n')
        else:
            if url_z == '(No URL)':
                fp.write('<tr><th colspan="7" align="center">'+razdel+'</th></tr>\n')
            else:
                fp.write('<tr><th colspan="7" align="center"><a href="'+url_z+'" target="_blank">'+razdel+'</a></th></tr>\n')
        continue
    idList+="'"+npp+"',"
    fp.write('<tr id="'+npp+'"  class="unprintable">\n')
    fp.write('<td  width="5%">'+npp+'</td>\n')

    if url=='(No URL)':
        fp.write('<td class="col45p"  id="'+npp+'_name" >'+nazvanie +'</td>'+'\n')
    else:
        fp.write('<td class="col45p"  id="'+npp+'_name" ><a href="'+url+'" target="_blank">'+nazvanie+'</a></td>'+'\n')

    fp.write('<td class="col10p"  id="'+npp+'_base_price">'+cena+'</td>\n')
    fp.write('<td class="col10p" ><input id="'+npp+'_input_count"')

    fp.write('class="book_count" type="number" value="" size="2"')
    fp.write('title="Введите необходимое Вам количество экз."')
    discount="{'10': '15','50': '25','100': '35'}"
    fp.write('oninput="sum_calculate(this.value,'+"'"+npp+"',"+cena+','+discount+')"></td>\n')

    fp.write('<td class="col10p" ><span id="'+npp+'_discPercent"> &mdash;</span></td>\n') #Размер скидки в процентах

    fp.write('<td class="col10p"  id="'+npp+'_sum_disc">&mdash;</td>\n')

    fp.write('<td class="col10p" ><span id="'+npp+'_sum_k_opl">&mdash;</span></td>\n')


    fp.write('</tr>\n')


with open ('part3.html', 'r', encoding="utf-8") as fl:
    part3=fl.read()

fp.write(part3)

with open ('partFooter.html', 'r', encoding="utf-8") as fl:
    partFooter=fl.read()


fp.write (partFooter)

fp.write("\n</body>\n<script>\n")
fp.write("var idList=["+idList+"]\n")

fp.write("</script>\n</html>")



fp.close()
