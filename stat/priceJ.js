var dat_today, num_offer, isClick=-1;
function inputDate (){
    var date = new Date();
    var monthes = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var day = date.getDate();
    var month = monthes[date.getMonth()];
    var year = date.getFullYear();

    dat_today='«' + day + '» ' + month + ' ' + year + ' г.';

    num_offer=Math.floor(Math.random() * (1000)) + 490;
    document.getElementById("offert_dat").innerHTML = dat_today ;
    document.getElementById("offert_numb").innerHTML = ("СЧЕТ-ДОГОВОР №&nbsp;"+num_offer);
}


function setFilt (elem)
{
// В качестве аргумента приходить value кнопки.
// Имена классов (групп журналов или книг) почти такие же как название разделов,  только без пробелов

// Удаляем класс "activeTheme" у старого пункта
var oldActive=document.getElementById('Themes').getElementsByClassName("activeTheme")[0];
oldActive.classList.remove("activeTheme");
// Присваиваем выбранному


if (elem) {
    elem.classList.add("activeTheme");
}
var tableElem=document.getElementsByTagName('tbody')[0];
var rows=tableElem.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++)
            {
              // Если выбран первый элемент меню, то сбрасывам фильтр. Используется также в viewOrder
              if (elem.value==document.getElementById("allThemes").value)
                {
                rows[i].style.display = "table-row";
                }
            else
                {
                // Удаляем все пробелы из надписи на кнопке, полученное значение становится именем класса
                if (!rows[i].classList.contains(elem.value.replace(/ /g, '')))
                    {
                        rows[i].style.display = "none";
                    }
                else
                    {
                        rows[i].style.display = "table-row";
                    }
                }
            }
}





function tip_note(tag_id, tip_text) {
 var obj = document.getElementById(tag_id); // берем интересующий элемент
 var coords = obj.getBoundingClientRect(); // верхний отступ эл-та от родителя
 var note = document.createElement('div');
 note.innerHTML = tip_text;
 note.className = "note";
 note.id="tip_note";
 note.style.left = (coords.left+20) + "px";
 note.style.top = coords.bottom + "px";
 document.body.appendChild(note);
}

function number_to_string(_number) {
        var _arr_numbers = new Array();
        _arr_numbers[1] = new Array('', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать');
        _arr_numbers[2] = new Array('', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто');
        _arr_numbers[3] = new Array('', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот');
        function number_parser(_num, _desc) {
                var _string = '';
                var _num_hundred = '';
                if (_num.length == 3) {
                        _num_hundred = _num.substr(0, 1);
                        _num = _num.substr(1, 3);
                        _string = _arr_numbers[3][_num_hundred] + ' ';
                }
                if (_num < 20) _string += _arr_numbers[1][parseFloat(_num)] + ' ';
                else {
                        var _first_num = _num.substr(0, 1);
                        var _second_num = _num.substr(1, 2);
                        _string += _arr_numbers[2][_first_num] + ' ' + _arr_numbers[1][_second_num] + ' ';
                }
                switch (_desc){
                        case 0:
                                var _last_num = parseFloat(_num.substr(-1));
                                var _two_last_num = parseFloat(_num.substr(-2));
                                if (_last_num == 1) _string += 'рубль';
                                else if (_last_num > 1 && _last_num < 5 && _two_last_num<10 && _two_last_num>15 ) _string += 'рубля';
                                else _string += 'рублей';
                                break;
                        case 1:
                                var _last_num = parseFloat(_num.substr(-1));
                                if (_last_num == 1) _string += 'тысяча ';
                                else if (_last_num > 1 && _last_num < 5) _string += 'тысячи ';
                                else _string += 'тысяч ';
                                _string = _string.replace('один ', 'одна ');
                                _string = _string.replace('два ', 'две ');
                                break;

                }
                _string = _string.replace('  ', ' ');
                return _string;
        }
        function decimals_parser(_num) {
                var _first_num = _num.substr(0, 1);
                var _second_num = parseFloat(_num.substr(1, 2));
                var _string = ' ' + _first_num + _second_num;
                if (_second_num == 1) _string += ' копейка';
                else if (_second_num > 1 && _second_num < 5) _string += ' копейки';
                else _string += ' копеек';
                return _string;
        }
        if (!_number || _number == 0) return false;
        if (typeof _number !== 'number') {
                _number = _number.replace(',', '.');
                _number = parseFloat(_number);
                if (isNaN(_number)) return false;
        }
        _number = _number.toFixed(2);
        if(_number.indexOf('.') != -1) {
                var _number_arr = _number.split('.');
                var _number = _number_arr[0];
                var _number_decimals = _number_arr[1];
        }
        var _number_length = _number.length;
        var _string = '';
        var _num_parser = '';
        var _count = 0;
        for (var _p = (_number_length - 1); _p >= 0; _p--) {
                var _num_digit = _number.substr(_p, 1);
                _num_parser = _num_digit +  _num_parser;
                if ((_num_parser.length == 3 || _p == 0) && !isNaN(parseFloat(_num_parser))) {
                        _string = number_parser(_num_parser, _count) + _string;
                        _num_parser = '';
                        _count++;
                }
        }
        if (_number_decimals) _string += decimals_parser(_number_decimals);
        //_string = _string.charAt(0).toUpperCase() + _string.substring(1);
        return _string;
}
function sum_calculate(book_pref,book_price, book_count)
 {
  var book_price=document.getElementById(book_pref+"_price").innerHTML;
    //var book_count=document.getElementById(book_pref+"_input_count").value;
    var id_disc=book_pref+"_sum_disc"; // Id скидки
    var id_sum=book_pref+"_sum_k_opl"; // Id суммы
    var id_count=book_pref+"_input_count"; // Id суммы
    var count; // Кол-во книг
    // Для перекраски строки
    var tr=document.getElementById(id_count).parentElement.parentElement
    //alert(tr);

    //book_count=book_count.replace(/^\s*/,'').replace(/\s*$/,'');


    if (book_count!='' & parseInt(book_count)!=0 ) {

        if(!book_count.match('[0-9]{1,3}'))
        {alert('Введите нужное Вам количество книг (целое число)');
        document.getElementById(id_count).focus();
        return}
        count= parseInt(book_count);

        localStorage[book_pref] = count
        // Перекрашиваем строку с ненулевым количеством


        }
    else {
        count=0;
        delete localStorage[book_pref]
        // Удаляем окраску строки если нулевое количеством
            }

// По идее нужно вынести в onLoad
            if (localStorage[book_pref]){
            tr.classList.add("selected")}
            else {
            tr.classList.remove("selected");
            document.getElementById(id_count).value = '';
            if (tr.classList.contains("forprint")) {
                tr.style.display = "none";
                tr.classList.remove("forprint");
            }




    }

    var sum_contract; // Сумма счета цифрами
    var disc=0; // Сумма скидки цифрами
    var disc_str=''; // Сумма скидки словами
    var sum_str=''; // Сумма счета словами





    var base_sum=count*book_price;



    sum_contract=base_sum;


    if (Math.round(sum_contract)>0){
        document.getElementById(id_sum).innerHTML = sum_contract.toFixed(2);
        }
    else {
        document.getElementById(id_sum).innerHTML = "&mdash;";
        document.getElementById(id_count).innerHTML = "";
    }



    var total_count=0;
    var name_count=0;
    var total_disc=0;
    var total_sum=0;
    var tempCount, tempDisc, tempSum;
    var tempWind=document.getElementById("totalWind")

// Поскольку HTML файл формируется програмно, в его конце можно вставить массив (список) со всеми префиксами
// Этот массив назхывается idList. Итерируем по нему и получаем суммарные скидки, количества, значения.


    for (let pref of idList) {
        id_count=pref+"_input_count";
        id_sum=pref+"_sum_k_opl";
        id_disc=pref+"_sum_disc";

        tempCount=parseInt(document.getElementById(id_count).value);
        tempDisc=parseFloat(document.getElementById(id_disc).innerHTML);
        tempSum=parseFloat(document.getElementById(id_sum).innerHTML);

        if (!isNaN(tempCount)) {
            name_count+=1;
            total_count+=tempCount;
            }

        if (!isNaN(tempSum)) {
            total_sum+=tempSum;
            }

        if (!isNaN(tempDisc)) {
            total_disc+=tempDisc;
            }
    }

    if (name_count>0&total_count>0) {
        //document.getElementById("totalWind").classList.add("visibleTrue");

        //document.getElementById("totalWind").style.visibility = "visible";
        tempWind.style.visibility = "visible";


        document.getElementById("name_count").innerHTML = "<b> "+name_count+" </b>";
        document.getElementById("item_count").innerHTML = "<b> "+total_count+" </b>";
        document.getElementById("sum_sum").innerHTML = "<b> "+total_sum.toFixed(2)+" </b>";




        }
    else {
        //document.getElementById("totalWind").classList.toggle("visibleTrue");
        document.getElementById("totalWind").style.visibility = "hidden";
        }

    if (total_count>0)  {
        document.getElementById("total_count").innerHTML = total_count;
        document.getElementById("total_sum").innerHTML = total_sum.toFixed(2);
        if (total_disc>0){
            document.getElementById("total_disc").innerHTML = total_disc.toFixed(2);
            disc_str="<br> <span id='disc' style='color:red;'> <b>Cкидка</b>: "+total_disc.toFixed(2)+" руб. ("+number_to_string(total_disc)+"). </span>";
            }
        else {
            document.getElementById("total_disc").innerHTML = "&mdash;";
            disc_str="<br> <span id='disc' style='color:red;'></span>"
        }

        sum_str="<b>Сумма к оплате</b>: "+ total_sum.toFixed(2)+" руб. ("+number_to_string(total_sum)+")."+disc_str;

        document.getElementById("sum_contract").innerHTML = sum_str ;

        }


    }



function viewOrder()
    {

        // Считаем нажатие кнопки: если нечетное число раз, то isClick=1 (в т. ч. первый раз), если четное, то -1
        isClick*=-1;

        // Снимаем фильтры по темам
        setFilt(document.getElementById("allThemes"));

        var aa=document.getElementsByClassName("selected");
        for (var i=0; i<aa.length; i++) {
            aa[i].style.backgroundColor=(isClick==1) ? "white" : "rgba(30, 144, 255, 0.35)";

            if ( aa[i].classList.contains("forprint") ) {
                aa[i].classList.remove("forprint");
            }
            else {
                aa[i].classList.add("forprint");
            }
        }
		
		//var DontBelieve=document.getElementById('DontBelieve');
		//DontBelieve.style.display = "none";
		
        var top_titl=document.getElementById('topTitl');
        top_titl.style.display = (isClick==-1) ? "block" : "none";

        var sum_contract=document.getElementById("sum_contract") ;
        sum_contract.style.visibility = (isClick==1) ? "visible" : "hidden";

        var Themes=document.getElementById('Themes');
        Themes.style.display = (isClick==-1) ? "block" : "none";

        var top_menu=document.getElementsByTagName('nav')[0];
        top_menu.style.display = (isClick==-1) ?  "block" : "none" ;

        var downLoadXls=document.getElementById('downLoadXls');
        downLoadXls.style.display = (isClick==-1) ?  "block" : "none" ;

        /*var warning=document.getElementById('warning');
        warning.style.display = (isClick==1) ?  "block" : "none" ;

        var whattodo=document.getElementById('whatToDo');
        whattodo.style.display = (isClick==1) ?  "none" : "block" ; */

        var shapka=document.getElementById('shapka');
        shapka.style.display = (isClick==-1) ?  "none": "table-row";

        var podval=document.getElementById('podval');
        podval.style.display = (isClick==1) ? "block" : "none";

        var knopka2=document.getElementById('knopka2');
        knopka2.style.visibility = (isClick==-1) ? "hidden" : "visible";

        var knopka1=document.getElementById('knopka1');
        knopka1.innerHTML =(isClick==-1) ? "Просмотреть<br>заказ":"Продолжить<br>заказывать" ;

        var mainDiv=document.getElementById('mainDiv');
        mainDiv.style.borderColor = (isClick==-1) ? "transparent": "gray" ;
        mainDiv.style.backgroundColor = (isClick==-1) ? "#ebebeb": "white"  ;


        var row;
        var tableElem=document.getElementsByTagName('tbody')[0]
        var rows=tableElem.getElementsByTagName('tr');

        for (var i = 0; i < rows.length; i++)
            {
            row=rows[i];
            if (!row.classList.contains("selected"))
                {
                row.style.display = (isClick==1) ? "none" : "table-row";
                }


            }

    }




function printSchet() {
    /*if (document.getElementById("disc"))
    {
        document.getElementById("disc").style.color ="black";
    }
    document.body.style.background = "#ffffff";
    document.body.style.background = "#ffffff";*/



    var tableElem=document.getElementsByTagName('tbody')[0];
    var rows=tableElem.getElementsByClassName ('selected');
    var line={};
    var order='';
    order+='Счет '+num_offer+' ';
    order+='от '+dat_today+'\n';
        order+='Id\tЦена\tКол-во\tСумма\t\n'
    var tds, lineJSON;

        for (var i = 0; i <rows.length; i++)
        {

            tds=rows[i].getElementsByTagName("td");
                order=order+tds[0].innerHTML+'\t';
                order=order+tds[2].innerHTML+'\t';
                order=order+tds[3].firstElementChild.value+'\t';
                order=order+tds[6].firstElementChild.innerHTML+'\t\n';
                order=order.replace('&nbsp;', ' ');
        }
    console.log(order);
    var eml='&eml=zakaz@energetika.by'




    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../stat/ord.php?timeStamp=" + new Date().getTime(), true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    //xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    //xhr.send("a="+aa.name+"&b="+aa.count);
    xhr.send("a="+order+eml);
    //Send the proper header information along with the request






    xhr.onreadystatechange = function(){
    if (this.readyState == 4) {
    if (this.status == 200)
      console.log(xhr.responseText);
    else
      console.log('ajax error');
  }
};

    window.print();


}

function insertThemes ()
{
    var first = document.getElementById("themesList").firstElementChild;
    for (var i=themeList.length-1; i>=0; i--)
    {
     var newTheme='<li><input value="'+themeList[i]+'" onclick="setFilt(this)" type="button"></li>';
        first.insertAdjacentHTML('afterEnd', newTheme);
    }

    document.getElementById("Themes").style.display="block";
    first.classList.add("activeTheme");

}
/* ****************************************************
function gotoAncor () {
document.body.addEventListener("focus", function(event){

},true);
}


 ************************************ */

function openWinDescr(id, path) {
var win = window.open(path+"/index.html");
}

function WindowOnfocus ()
{
    for (let pref of idList)
    {
        if (localStorage[pref])
        {
        document.getElementById(pref+'_input_count').value=localStorage[pref];
        sum_calculate(pref, 0,localStorage[pref]);
		console.log(pref, ' ',localStorage[pref]);
		
        }
        else
        {
            sum_calculate(pref,0, 0);
        }
    }
}
/*
document.addEventListener("load", scroll_to_view);

function scroll_to_view() {

    if (window.location.hash.length>0)
      {
        window.location.hash;
        var tempScroll=window.pageYOffset;

        //alert('Поймали Хэш')
         // Переместим позицию скрола на 100px
        window.location.href.split('#')[0];
        document.removeEventListener("load", scroll_to_view);
        alert(window.location.href.split('#')[0]+'    '+tempScroll);

        window.scrollTo(0, tempScroll-50);
      }


}

*/













