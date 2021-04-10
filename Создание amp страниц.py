import xlrd
import re
import time
import ftplib
import shutil
import datetime
import os
import sys


def extract_string_between_tag (searched_string, first_tag, second_tag=""):
    if searched_string.find(first_tag)>=0:
        begin_tag_position=searched_string.find(first_tag)+len(first_tag)
        if second_tag=="":
            return searched_string[begin_tag_position:]
        else:
            end_tag_position=searched_string.find(second_tag, begin_tag_position+1)
            return searched_string[begin_tag_position:end_tag_position]
    else:
        return ""













# Копируем и передаем на сервер фалй прайса
# Создаем новое имя для прайса, который скопируем на сервер. Оно включает дату
now = str(datetime.datetime.now())
print(str(now))

den=now[8:10]
mes=now[5:7]
god=now[:4]

date_mod=now[0:10]
time_mod=now[11:19]

amp_dateModified=now[0:10]+'T'+now[11:19]+'+03:00'
#print('amp_dateModifie: ',amp_dateModified)

amp_priceValidUntil=str(int(god)+1)+'-'+mes+'-'+den #{{amp-priceValidUntil}} Дата до которой действует цена в микроразметке
#print(amp_priceValidUntil)



new_name='Price Energopress TNPA '+den+'-'+mes+'-'+god+'.xls'
new_nameJ='Price Energopress Journals '+den+'-'+mes+'-'+god+'.xls'
#path=r'\\Buh\подписка\Прайсы'
path=''
price=r'Price Energopress TNPA 06-03-2021.xls'

#Создаем HTML страницу из файла прайса

#fp = open(os.path.join(path,'Прайс для сайта.html'), 'w')



nazvanie=' '
postanovlenie=' '
cena="0.00"
kol='  '
idList=''






# Записываем дату обновления

#Создаем заголовок таблицы





#Открываем файл Прайс.xls
rbook = xlrd.open_workbook(os.path.join(path,price))
# Получаем доступ к листу
rsheet=rbook.sheet_by_index(0)
i=0
for str_num in range(14,rsheet.nrows):
    i+=1

#Создаем тело таблицы
    razdel=str(rsheet.cell(str_num,0).value)
    hpl_z=rsheet.hyperlink_map.get((str_num,3)) #получаем ссылку на html страницу

    #******************** Строки для тестирования **************************
    #hpl_z='https://enp.by/tkp-458-459/'
    #url_z=hpl_z
    #********************* Отключить после отладки *****************

    # !!!!!!!!!!!!!!! Следующую строку Включить после отладки
    url_z = '(No URL)' if hpl_z is None else hpl_z.url_or_path # полученную ссылку помещаем в переменную
    current_dir=os.getcwd() #запоминаем путь рабочего каталога
    parent_dir=os.path.abspath(os.path.join(path, os.pardir)) #запоминаем путь родительского каталога (по отношению к рабочему)

    if url_z != '(No URL)': #если ссылка не пустая
        check_folder=os.path.join(parent_dir, url_z.split('/')[3])
        #формируем путь к проверяемому каталогу: родительский каталог + имя html каталога, полученное из ссылки
        check_amp_folder=os.path.join(check_folder, 'amp') # Путь к amp - папке в проверяемом каталоге

        if  1==1: #not os.path.isdir(check_amp_folder):

            with open (os.path.join(check_folder,'index.html'), 'r', encoding="utf-8") as fl:
                html_base=fl.read()

                canonical_adress=url_z

                amp_title=extract_string_between_tag (html_base, "<title>", "</title>").strip() #{{amp-title}}
                amp_title=amp_title.replace('&nbsp;',' ')
                print('Title=',amp_title)

                amp_headline=amp_title.strip()[:119]

                amp_description = extract_string_between_tag (html_base, '<meta name="description" content=', '>').strip() #{{amp-description-content}}


                amp_keywords = extract_string_between_tag (html_base, '<meta name="keywords" content=', '>').strip() #{{amp-keywords-content}}


                amp_h1=extract_string_between_tag (html_base,'<h1>','</h1>').strip() #{{amp-h1}}


                if html_base.find('<time datetime="')>=0:
                    amp_datetime_system=extract_string_between_tag (html_base,'<time datetime="','">') #{{amp-datetime-system}}
                else:
                     amp_datetime_system=date_mod
                months=['января', 'февраля', 'марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
                amp_date_russian=amp_datetime_system.split('-')[2]+'&nbsp;'+months[int(amp_datetime_system.split('-')[1])-1]+' '+amp_datetime_system.split('-')[0]+'&nbsp;г.'

                if html_base.find('<div id="imgCover">')>=0:
                    temp_string=extract_string_between_tag (html_base,'<div id="imgCover">', '</div>')
                    amp_img_cover=extract_string_between_tag (temp_string, 'src="', '"')
                    amp_alt_img_cover=extract_string_between_tag (temp_string, 'alt="', '"')
                else:
                    temp_string=extract_string_between_tag (html_base, '<img>', '</img>')  #{{amp-cover}}
                    if temp_string.find ('id="cover"')>=0:
                        amp_img_cover=extract_string_between_tag (temp_string, 'src="', '"')
                        amp_alt_img_cover=extract_string_between_tag (temp_string, 'alt="', '"')
                amp_image_full_adress=canonical_adress+amp_img_cover


                new_table=True
                if html_base.find('<table id="detailed">')>=0:
                    temp_table_detailed=extract_string_between_tag (html_base, '<table id="detailed">', '</table>')

                else:
                     if html_base.find('<div id="details">')>=0:
                        temp_table_detailed=extract_string_between_tag (html_base, '<table align="center" cellpadding="10" cellspacing="10">', '</table>')

                        new_table=False


                if len(temp_table_detailed)>0:


                    amp_effective_date=extract_string_between_tag(temp_table_detailed.split('</td>')[1].strip(), '<td class="col75">').strip() #{{amp-effective-date}}


                    amp_number_of_page=extract_string_between_tag(temp_table_detailed.split('</td>')[3].strip(), '<td class="col75">').strip()#{{amp-number-of-page}}


                    amp_cover=extract_string_between_tag(temp_table_detailed.split('</td>')[5].strip(), '<td class="col75">').strip()#{{amp-price}}

                    if new_table:
                        amp_price=extract_string_between_tag(temp_table_detailed.split('</td>')[9].strip(), '<td class="col75">').strip()#{{amp-price}}
                    else:
                        amp_price=extract_string_between_tag(temp_table_detailed.split('</td>')[11].strip(), '<td class="col75">').strip()#{{amp-price}}

                    # Проверяем, существует естьли в 9 строке таблицы оглавление не должно быть кнопки с классом but:

                    if new_table:
                        row9=temp_table_detailed.split('<tr>')[8]
                        if row9.find('class="butt')<0:  #если есть строка с содержанием
                            amp_pdf_content=('<a href="../'+
                            extract_string_between_tag(row9,'<a href=', '.pdf')[1:]+'.pdf"')
                            amp_pdf_content+=' target="_blank">Оглавление и ознакомительный фрагмент</a>' #{{amp-pdf-content}}

                            row10=temp_table_detailed.split('<tr>')[9]
                            amp_order_with_attributes=extract_string_between_tag(row10,'/stat/', '"')   #{{amp-order-with-attributes}}
                            amp_order_numb=extract_string_between_tag(row10, 'order_numb=', '"')        #{{amp-order-numb}}

                        else:   #если нет строки с содержанием, то в этой строке находится кнопка
                            amp_pdf_content=""
                            amp_order_with_attributes=extract_string_between_tag(row9,'/stat/', '"')    #{{amp-order-with-attributes}}
                            amp_order_numb=extract_string_between_tag(row9, 'order_numb=', '"')         #{{amp-order-numb}}
                    else: #если старая таблица, то  здесь оглавление и ознакомительный фрагмент
                        row4=temp_table_detailed.split('<tr>')[4]

                        amp_pdf_content=('<a href="../'+
                        extract_string_between_tag(row4,'<a href=', '.pdf')[1:]+'.pdf"')
                        amp_pdf_content+=' target="_blank">Оглавление и ознакомительный фрагмент</a>'

                        row10=temp_table_detailed.split('<tr>')[9]

                        #amp_pdf_content=""
                        amp_order_with_attributes=extract_string_between_tag(row10,'/stat/', '"')    #{{amp-order-with-attributes}}
                        amp_order_numb=extract_string_between_tag(row10, 'order_numb=', '"')         #{{amp-order-numb}}



                amp_article=extract_string_between_tag (html_base,'<article>','</article>') #{{amp-article}}

                amp_article=amp_article.replace('<a href="','<a href="../')


                path_stat=os.path.join(parent_dir, 'stat')

                with open (os.path.join(path_stat, 'amp.css') , 'r', encoding="utf-8") as fcss:
                    amp_css=fcss.read()

                with open ('amp-template.html', 'r', encoding="utf-8") as fo:
                    template=fo.read()

                template=template.replace('{{amp-css}}', amp_css)
                template=template.replace('{{canonical-adress}}',canonical_adress)
                template=template.replace('{{amp-priceValidUntil}}', amp_priceValidUntil)
                template=template.replace('{{amp-image-full-adress}}', amp_image_full_adress)
                template=template.replace('{{amp-dateModified}}', amp_dateModified)
                template=template.replace('{{amp-order-numb}}', amp_order_numb)

                template=template.replace('{{amp-headline}}',amp_headline)
                template=template.replace('{{amp-title}}', amp_title)
                template=template.replace('{{amp-description}}', amp_description)
                template=template.replace('{{amp-keywords}}', amp_keywords)
                template=template.replace('{{amp-img-cover}}', amp_img_cover)
                template=template.replace('{{amp-alt-img-cover}}', amp_alt_img_cover)

                template=template.replace('{{amp-h1}}', amp_h1)
                template=template.replace('{{amp-datetime-system}}', amp_datetime_system)
                template=template.replace('{{amp-date-russian}}', amp_date_russian)
                template=template.replace('{{amp-cover}}', amp_cover)
                template=template.replace('{{amp-effective-date}}', amp_effective_date)
                template=template.replace('{{amp-number-of-page}}', amp_number_of_page)
                template=template.replace('{{amp-price}}', amp_price)
                template=template.replace('{{amp-pdf-content}}', amp_pdf_content)
                template=template.replace('{{amp-order-with-attributes}}', amp_order_with_attributes)
                template=template.replace('{{amp-article}}', amp_article)
                if not os.path.exists(check_amp_folder):
                    os.mkdir(check_amp_folder)
                fp = open(os.path.join(check_amp_folder,'amp-index.html'), 'w', encoding="utf-8")




                fp.write(template)
                fp.close()

