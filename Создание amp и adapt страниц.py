import xlrd
import re
import time
import ftplib
import shutil
import datetime
import os
import sys
import json


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


now = str(datetime.datetime.now())
den=now[8:10]
mes=now[5:7]
god=now[:4]
 

# Дата и время внесения изменений
date_mod=now[0:10]
time_mod=now[11:19]
amp_dateModified=now[0:10]+'T'+now[11:19]+'+03:00'
amp_priceValidUntil=str(int(god)+1)+'-'+mes+'-'+den #{{amp-priceValidUntil}} Дата до которой действует цена в микроразметке



# Создаем список проверенных файлов 
list_changed_url=''

# Пути к базовым каталогам
current_dir=os.getcwd() #запоминаем путь рабочего каталога
parent_dir=os.path.abspath(os.path.join(os.path.dirname(__file__),"..")) #запоминаем путь родительского каталога (по отношению к рабочему)



price="Price Energopress TNPA 21-03-2021.xls"
path=current_dir

# Открываем и читаем сайтмап
with open (os.path.join(os.path.dirname(__file__),'sitemap.xml'), 'r', encoding="utf-8") as fsitemap:
    temp_map=fsitemap.read()





#Открываем файл Прайс.xls
rbook = xlrd.open_workbook(os.path.join(path,price))
# Получаем доступ к листу
rsheet=rbook.sheet_by_index(0)
j=0
# Читаем файл построчно
for str_num in range(14,rsheet.nrows):
#Читаем тело таблицы
    razdel=str(rsheet.cell(str_num,0).value)
    hpl_z=rsheet.hyperlink_map.get((str_num,3)) #получаем ссылку на html страницу
    kod_from_price=str(rsheet.cell(str_num,1).value).strip()
    price_from_price=rsheet.cell(str_num,5).value
    if isinstance(price_from_price, float):
        price_from_price=f'{price_from_price:,.2f}'  # Преобразование для двух знаков после запятой для чисел типа 31.10. Без него сжимает до 31.1
    
    name_from_price=str(rsheet.cell(str_num,2).value).strip()
    

    #******************** Строки для тестирования **************************
    #hpl_z='https://enp.by/tkp-458-459/'
    #url_z=hpl_z
    #********************* Отключить после отладки *****************

    # !!!!!!!!!!!!!!! Следующую строку Включить после отладки
    url_z = '(No URL)' if hpl_z is None else hpl_z.url_or_path # полученную ссылку помещаем в переменную

    if url_z != '(No URL)': #если ссылка не пустая
        j+=1
        canonical_adress=url_z.replace("index.html","") #удаляем, если есть index.html
        canonical_adress=canonical_adress.replace('www.', '') #удаляем, если есть www.
        canonical_adress=canonical_adress.replace('http:', 'https:') #заменяем, если есть http:.          
        if canonical_adress[-1]!="/":
            canonical_adress+="/"
            
        check_folder=os.path.join(parent_dir, url_z.split('/')[3])
        #формируем путь к проверяемому каталогу: родительский каталог + имя html каталога, полученное из ссылки
        
        check_amp_folder=os.path.join(check_folder, 'amp') # Путь к amp - папке в проверяемом каталоге
        


        
        
        if  1==1: #not os.path.isdir(check_amp_folder):
            with open (os.path.join(check_folder,'index.html'), 'r', encoding="utf-8") as fl:
                html_base=fl.read()
                #html_base=html_base.replace("\n", " ")
                html_base=html_base.replace("  ", " ")
                html_base=html_base.replace("balnk", "blank") # замеченные опечатки в наименовании тегов
                html_base=html_base.replace("traget", "target") # замеченные опечатки в наименовании тегов
                match=re.search('<'+r'\w\d{8}'+'>', html_base) # удаление похожих на теги элементов в спике изменений типа <C12345678>
                if not match is None:
                    html_base=re.sub('<'+r'\w\d{8}'+'>', '', html_base)



                amp_title=extract_string_between_tag (html_base, "<title>", "</title>").strip() #{{amp-title}}
                amp_title=amp_title.replace('&nbsp;',' ')
                print('Title=',amp_title)

                amp_headline=amp_title.strip()[:119]
                amp_description = extract_string_between_tag (html_base, '<meta name="description" content=', '>').strip() #{{amp-description-content}}


                amp_keywords = extract_string_between_tag (html_base, '<meta name="keywords" content=', '>').strip() #{{amp-keywords-content}}


                amp_h1=extract_string_between_tag (html_base,'<h1>','</h1>').strip() #{{amp-h1}}

                amp_remark=extract_string_between_tag(html_base,'</h1>','<div id="pageDate">').strip() #{{amp-h1}}
                amp_remark=amp_remark.replace('style="clear:both"',"").strip()
                amp_remark=re.sub('<\s+', '<', amp_remark)
                amp_remark=re.sub('\s+>', '>', amp_remark)
                amp_remark=re.sub('^<div>', '', amp_remark)
                amp_remark=re.sub('</div>$', '', amp_remark)

                amp_remark=amp_remark.replace('<small>', "")
                amp_remark=amp_remark.replace('</small>', "")




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


                if html_base.find('<table id="detailed">')>=0:
                    temp_table_detailed=extract_string_between_tag (html_base, '<table id="detailed">', '</table>')
                else:
                     if html_base.find('<div id="details">')>=0:
                        temp_table_detailed=extract_string_between_tag (html_base, '<table align="center" cellpadding="10" cellspacing="10">', '</table>')




                amp_order_with_attributes='Schet.html?title='+name_from_price+\
                                           '&price='+price_from_price+\
                                           '&order_numb='+kod_from_price #{{amp-order-with-attributes}}

                #Schet.html?title={{h1-with-span}}&price={{price}}&order_numb={{order-numb}}
                #print(amp_order_with_attributes)
                #input()



                if len(temp_table_detailed)>0:
                    rows_list=temp_table_detailed.split('<tr>')
                    amp_effective_date=\
                    amp_number_of_page=\
                    amp_pdf_content=\
                    amp_cover=\
                    amp_discount=" "
# *******!!!!!!!!!!!!!!!!! Сделать, чтобы дисконты читались из xls-прайса, передавались и обрабатывались при выставлении счета

                    for table_row in rows_list:
                        if table_row.upper().find('В СИЛУ')>=0 or table_row.upper().find('ВСТУП')>=0: #{{amp-effective-date}}
                            amp_effective_date=extract_string_between_tag(table_row, '<td class="col75">', '</td>')


                        elif table_row.upper().find('СТРАНИЦ')>=0: #{{amp-number-of-page}}
                            amp_number_of_page=extract_string_between_tag(table_row, '<td class="col75">', '</td>')


                        elif table_row.upper().find('СКАЧАТЬ')>=0 or table_row.upper().find('PDF')>=0:
                            amp_pdf_content=(extract_string_between_tag(table_row,'<a href=', '.pdf')[1:]+'.pdf"')
                            amp_pdf_content+=' target="_blank">Оглавление и ознакомительный фрагмент</a>' #{{amp-pdf-content}}
                            adapt_pdf_content='<a href="'+amp_pdf_content
                            amp_pdf_content='<a href="../'+amp_pdf_content

                        elif table_row.upper().find('ПЕРЕПЛЕТ')>=0 or table_row.upper().find('ОБЛОЖКА')>=0:
                            amp_cover=extract_string_between_tag(table_row, '<td class="col75">', '</td>') #{{amp-cover}}


                        elif table_row.upper().find('СКИДК')>=0 :
                            amp_discount=extract_string_between_tag(table_row, '<td class="col75">', '</td>') #{{amp-discount}}



                amp_article=extract_string_between_tag (html_base,'<article>','</article>') #{{amp-article}}

# В новых файлах <div class="official"> находится внутри article 
#  offical может не быть вообще ЕСТЬ!, может быть внутри article (в новых файлах), может быть отдельным блоком в старых

                
                if html_base.find('Скачать официальный текст')==-1 \
                or amp_article.find('Скачать официальный текст')>-1\
                or amp_article.find('<div class="official')>-1: 
                # если нет вообще или уже внутри <article>, то добавляем в article все, что между <article> и <footer>
                    amp_after_article=extract_string_between_tag (html_base,'</article>', '<footer>').strip()
                    amp_after_article=amp_after_article.replace('</div>', ' ').strip()
                    amp_article=amp_article+'\n'+amp_after_article
                else:
                    # между </article> и  официальным текстом:
                    amp_after_article=extract_string_between_tag (html_base,'</article>', '<div class="official">').strip()
                    amp_after_article=amp_after_article.replace('</div>', ' ').strip()
                    amp_article=amp_article+'\n'+amp_after_article
                    # Сам официальный текст 
                    amp_offical='<div class="official">\n'+extract_string_between_tag (html_base,'<div class="official">','</table>')+'</table>\n</div>\n</div>'
                    amp_offical=amp_offical.replace('style="font-size:75%"','')
                    amp_offical=amp_offical.replace('h2>', 'h3>')
                    amp_article=amp_article+'\n'+amp_offical

                schet_for_replace=extract_string_between_tag(amp_article, 'Schet.html?title=', '"')
                if len(schet_for_replace)>0:
                    amp_article=amp_article.replace(schet_for_replace, amp_order_with_attributes)


                adapt_article=amp_article   # Потому, что в amp_article позже происходит замена ссылок     
                adapt_remark=amp_remark
                
                # Формируем базу данных
                # Записываем текст article и remark в файл html (для последующего редактирования)

                with open (os.path.join(check_folder,'remark-and-article.html'), 'w', encoding="utf-8") as fhtml:

                    fhtml.write('<!--******************************Remark******************************-->\n')
                    fhtml.write('<remark>\n\t')
                    fhtml.write(adapt_remark.replace('\n','\n\t')+'\n')
                    fhtml.write('</remark>\n')
                    fhtml.write('<!--******************************Article******************************-->\n')
                    fhtml.write('<article>\n\t')
                    fhtml.write(adapt_article.replace('\n','\n\t')+'\n')
                    fhtml.write('</article>')
                    


                file_amp_remark=file_amp_article=str(os.path.join(check_folder,'remark-and_article.html'))


                total_json={
                'canonical-adress':canonical_adress,
                'amp-priceValidUntil': amp_priceValidUntil,
                'amp-image-full-adress': amp_image_full_adress,
                'amp-dateModified': amp_dateModified,
                'amp-order-numb': kod_from_price,
                'amp-headline':amp_headline,
                'amp-title': amp_title,
                'amp-description': amp_description,
                'amp-keywords': amp_keywords,
                'amp-img-cover': amp_img_cover,
                'amp-alt-img-cover': amp_alt_img_cover,
                'amp-h1': amp_h1,
                'amp-remark': file_amp_remark,
                'amp-datetime-system': amp_datetime_system,
                'amp-date-russian': amp_date_russian,
                'amp-cover': amp_cover,
                'amp-discount': amp_discount,
                'amp-effective-date': amp_effective_date,
                'amp-number-of-page': amp_number_of_page,
                'amp-price': price_from_price,
                'amp-pdf-content': amp_pdf_content,
                'amp-order-with-attributes':amp_order_with_attributes,
                'amp-article': file_amp_article}


#*********************** Формирование amp-файла



                path_stat=os.path.join(parent_dir, 'stat')

                #with open (os.path.join(path_stat, 'amp.css') , 'r', encoding="utf-8") as fcss:
                with open ('amp.css' , 'r', encoding="utf-8") as fcss:
                    amp_css=fcss.read()

                with open ('amp-template.html', 'r', encoding="utf-8") as famp:
                    template=famp.read()

                template=template.replace('{{amp-css}}', amp_css)
                template=template.replace('{{canonical-adress}}',canonical_adress)
                template=template.replace('{{amp-priceValidUntil}}', amp_priceValidUntil)
                template=template.replace('{{amp-image-full-adress}}', amp_image_full_adress)
                template=template.replace('{{amp-dateModified}}', amp_dateModified)
                template=template.replace('{{amp-order-numb}}', kod_from_price)
                template=template.replace('{{amp-headline}}',amp_headline)
                template=template.replace('{{amp-title}}', amp_title)
                template=template.replace('{{amp-description}}', amp_description.replace('"',''))
                template=template.replace('{{amp-keywords}}', amp_keywords.replace('"',''))
                template=template.replace('{{amp-img-cover}}', amp_img_cover)
                template=template.replace('{{amp-alt-img-cover}}', amp_alt_img_cover)
                template=template.replace('{{amp-h1}}', amp_h1)
                adapt_remark=amp_remark #Потому, что меняется длина ссылок (удлиняется путь к amp)
                amp_remark=amp_remark.replace('<a href="','<a href="../')
                amp_remark=amp_remark.replace("<a href='","<a href='../")
                template=template.replace('{{amp-remark}}', amp_remark)

                template=template.replace('{{amp-datetime-system}}', amp_datetime_system)
                template=template.replace('{{amp-date-russian}}', amp_date_russian)
                template=template.replace('{{amp-cover}}', amp_cover)
                template=template.replace('{{amp-discount}}', amp_discount)
                template=template.replace('{{amp-effective-date}}', amp_effective_date)
                template=template.replace('{{amp-number-of-page}}', amp_number_of_page)
                template=template.replace('{{amp-price}}', price_from_price)
                template=template.replace('{{amp-pdf-content}}', amp_pdf_content)
                template=template.replace('{{amp-order-with-attributes}}', amp_order_with_attributes)

                amp_article=amp_article.replace('<a href="','<a href="../')
                amp_article=amp_article.replace("<a href='","<a href='../")
                template=template.replace('{{amp-article}}', amp_article)


                list_changed_url+=canonical_adress
                list_changed_url+='amp\n'
                #list_changed_url+=check_folder
                #list_changed_url+='\n'
                # Записываем amp  файл в новый каталог
                new_folder=os.path.join(os.path.dirname(__file__), 'new')
                
                if  not os.path.exists (new_folder):  #Если нет каталога new, создаем его
                   os.mkdir(new_folder)     

                new_folder=os.path.join(new_folder,  url_z.split('/')[3])
    
                if  not os.path.exists (new_folder):
                   os.mkdir(new_folder)     #создаем  папку документа в каталоге new
                                   
                new_amp_folder=os.path.join(new_folder, 'amp')
                if not os.path.exists (new_amp_folder):
                    os.mkdir(new_amp_folder)     



                
                with open(os.path.join(new_amp_folder,'index.html'), 'w', encoding="utf-8") as fp:
                    fp.write(template)    



                with open(os.path.join(check_amp_folder,'amp-index.html'), 'w', encoding="utf-8") as fp:
                    fp.write(template)

                
                
                with open(os.path.join(check_amp_folder,'amp-index.html'), 'w', encoding="utf-8") as fp:
                    fp.write(template)
                
                    
                    
                    
#********************************** Создаем адаптивную страницу******************************
                with open ('adapt-template.html', 'r', encoding="utf-8") as fadapt:
                    template=fadapt.read()

                #template=template.replace('{{adapt-css}}', amp_css)
                template=template.replace('{{amp-link}}',canonical_adress+'amp')
                template=template.replace('{{adapt-image-full-adress}}', amp_image_full_adress)
                template=template.replace('{{adapt-dateModified}}', amp_dateModified)
                template=template.replace('{{adapt-order-numb}}', kod_from_price)
                template=template.replace('{{adapt-headline}}',amp_headline)
                template=template.replace('{{adapt-title}}', amp_title)
                template=template.replace('{{adapt-description}}', amp_description.replace('"',''))
                template=template.replace('{{adapt-keywords}}', amp_keywords.replace('"',''))
                template=template.replace('{{adapt-img-cover}}', amp_img_cover)
                template=template.replace('{{adapt-alt-img-cover}}', amp_alt_img_cover)
                template=template.replace('{{adapt-h1}}', amp_h1)
                template=template.replace('{{adapt-remark}}', adapt_remark)

                template=template.replace('{{adapt-datetime-system}}', amp_datetime_system)
                template=template.replace('{{adapt-date-russian}}', amp_date_russian)
                template=template.replace('{{adapt-cover}}', amp_cover)
                template=template.replace('{{adapt-discount}}', amp_discount)
                template=template.replace('{{adapt-effective-date}}', amp_effective_date)
                template=template.replace('{{adapt-number-of-page}}', amp_number_of_page)
                template=template.replace('{{adapt-price}}', price_from_price)
                template=template.replace('{{adapt-pdf-content}}', amp_pdf_content)
                template=template.replace('{{adapt-order-with-attributes}}', amp_order_with_attributes)

                amp_article=amp_article.replace('<a href="','<a href="../')
                amp_article=amp_article.replace("<a href='","<a href='../")
                template=template.replace('{{adapt-article}}', adapt_article)
                
                with open(os.path.join(check_folder,'adapt-index.html'), 'w', encoding="utf-8") as fnew:
                    fnew.write(template)       

                with open(os.path.join(new_folder,'index.html'), 'w', encoding="utf-8") as fp:
                    fp.write(template)           

                
                for temp_keys in total_json:   # Удаляем знаки табуляции
                    total_json[temp_keys]=total_json[temp_keys].replace('\t','')
                #total_json_string=json.dumps(total_json, ensure_ascii=False).encode('utf8')

                if not os.path.exists(check_amp_folder):
                    os.mkdir(check_amp_folder)
               
                with open (os.path.join(check_folder,'json.txt'), 'w', encoding="utf-8") as js:
                    json.dump(total_json, js, ensure_ascii=False, indent=4)
                #    js.write(total_json_string.decode())
               



                # проверяем, есть ли ссылка в sitemap.xml    
                beg=temp_map.find(canonical_adress)
                if beg>-1:
                    beg_old_time=temp_map.find('<lastmod>', beg)
                    end__old_time=temp_map.find('</lastmod>', beg)+len('</lastmod>')
                    old_date=temp_map[beg_old_time:end__old_time]
                    print (old_date)
                    print('<lastmod>'+amp_dateModified+'</lastmod>')
                    temp_map=temp_map[:beg_old_time]+'    <lastmod>'+amp_dateModified+'</lastmod>'+temp_map[end__old_time:]
                    
                    

with open (os.path.join(current_dir, 'change.txt'), 'w', encoding="utf-8") as flikns:
    flikns.write(list_changed_url)

with open (os.path.join(current_dir, 'new_sitemap.xml'), 'w', encoding="utf-8") as fsitemap:
    fsitemap.write(temp_map)
    print (j)
