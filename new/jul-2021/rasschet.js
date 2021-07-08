
function inputDate (){
    var date = new Date();
    var monthes = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var day = date.getDate();
    var month = monthes[date.getMonth()];
    var year = date.getFullYear();

    dat_today='«' + day + '» ' + month + ' ' + year + ' г.';

    num_offer=Math.floor(Math.random() * (1000)) + 880;
    document.getElementById("offert_dat").innerHTML = dat_today ;
    document.getElementById("offert_number").innerHTML = ("СЧЕТ-ДОГОВОР № "+num_offer);
}


//Вставка подсказки
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
                                else if (_last_num > 1 && _last_num < 5) _string += 'рубля';
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
                        case 2:
                                var _last_num = parseFloat(_num.substr(-1));
                                if (_last_num == 1) _string += 'миллион ';
                                else if (_last_num > 1 && _last_num < 5) _string += 'миллиона ';
                                else _string += 'миллионов ';
                                break;
                        case 3:
                                var _last_num = parseFloat(_num.substr(-1));
                                if (_last_num == 1) _string += 'миллиард ';
                                else if (_last_num > 1 && _last_num < 5) _string += 'миллиарда ';
                                else _string += 'миллиардов ';
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
function sum_calculate(count, itemId, base_price, Discount={Infinity: "0"})
	{
	let sum_contract; // Сумма счета цифрами
	let disc=0; // Сумма скидки цифрами
	let discPercent=0; // Размер скидки цифрами
	let disc_str=''; // Сумма скидки словами
	let sum_str=''; // Сумма счета словами
	let base_sum; // Полная сумма без учета скидки (базовая цена*количество). Используется для расчета размера скидки. 
	
	//Получаем размер скидки
	for (let i in Discount)	{
		//Перебираем ключи объекта Discount, которые являются количеством единиц, необходимых для получения скидки
		//Discount - примерно такого вида: {"10": "15","50": "25","100": "35"}, где  
		// {"Количество 1" : "размер скидки 1", "Количество 2" : "размер скидки 2", "Количество 3" : "размер скидки 3"}	
		if (count>=i*1) {discPercent=Discount[i]*1;}
		else {break}
	}
	base_sum=count*base_price;
	sum_contract=count*Math.round(base_price*(100-discPercent))/100;
	disc=base_sum-sum_contract; //Считаем сумму скидки
	
// Вставка строки
	
	insert_in_row (itemId, count, discPercent, disc, sum_contract );


//Общей суммы	и суммы словами
	insert_total_sum();
	
	
	
	
	}

function insert_in_row (itemId, count, discPercent, disc, sum_contract)
{
if (count>0) 
{
	
	document.getElementById(itemId+"_input_count").value=parseInt(count);
	document.getElementById(itemId+"_sum_k_opl").innerHTML =sum_contract.toFixed(2);
	document.getElementById(itemId+"_sum_disc").innerHTML =disc.toFixed(2);
	document.getElementById(itemId+"_discPercent").innerHTML =discPercent+"%";
	document.getElementById(itemId).classList.remove("unprintable");	
}
else 
{
	
	document.getElementById(itemId+"_input_count").value='';
	document.getElementById(itemId+"_sum_k_opl").innerHTML ="&mdash;";
	document.getElementById(itemId+"_sum_disc").innerHTML ="&mdash;";
	document.getElementById(itemId+"_discPercent").innerHTML ="&mdash;";
	document.getElementById(itemId).classList.add("unprintable");	
}

}


/* Функция рассчета общей суммы счета. Пробегает по всем элементам списка itemlist и складывает суммы и скидки */
function insert_total_sum()
{
var totalSum=0, totalDisc=0, totalCount=0;	
for (let i=0; i<itemList.length; ++i)	
{
	let tempSum=document.getElementById(itemList[i]+"_sum_k_opl").innerHTML;
	totalSum+=parseFloat(tempSum) ? parseFloat(tempSum):0;
	
	let tempDisc=document.getElementById(itemList[i]+"_sum_disc").innerHTML;
	totalDisc+=parseFloat(tempDisc) ? parseFloat(tempDisc):0;
	
	totalCount+=document.getElementById(itemList[i]+"_input_count").value*1;
	
}
document.getElementById("totalCount").innerHTML =totalCount;
document.getElementById("totalDisc").innerHTML =totalDisc.toFixed(2);
document.getElementById("totalSum").innerHTML =totalSum.toFixed(2);	
if (totalSum>0)
{
	document.getElementById("sum_contract").innerHTML =totalSum.toFixed(2)+' ('+ number_to_string(totalSum)+')';
	
	if (totalDisc>0) 
	{ 	document.getElementById("skidki").innerHTML ='<b>Скидка</b>: '+totalDisc.toFixed(2)+' ('+number_to_string(totalDisc)+')';
		document.getElementById("skidki").classList.remove("unprintable");	
	}
	else
	{
	document.getElementById("skidki").innerHTML ='<span class="bannerR"> CКИДКИ:</span> <span class="discount"> 15%</span> &ndash; от 10 до 49 экз., <span class="discount"> 25%</span> &ndash; от 50 до 99 экз., <span class="discount"> 35%</span> &ndash; 100 и более экз.';
	document.getElementById("skidki").classList.add("unprintable");	
	}

}	
else
{
	document.getElementById("sum_contract").innerHTML ="0.00";
	document.getElementById("skidki").innerHTML ='<span class="bannerR"> CКИДКИ:</span> <span class="discount"> 15%</span> &ndash; от 10 до 49 экз., <span class="discount"> 25%</span> &ndash; от 50 до 99 экз., <span class="discount"> 35%</span> &ndash; 100 и более экз.';
	document.getElementById("skidki").classList.add("unprintable");	
	/*document.getElementById("bannerB").style.display="block";*/
}
}



function printSchet() {
	let space_before, space_after;
    var line={};
    var order='────────────────────────────────────────────────────────────────────────────────┐\n';
    var order_numb_dat='Счет '+document.getElementById("offert_number").innerHTML+' '
	order_numb_dat+='от '+document.getElementById("offert_dat").innerHTML;

	
	space_after=80-order_numb_dat.length;
	for (let i=0; i<space_after; i++) {order_numb_dat+=' '};
	order+=order_numb_dat+'│\n'
	
	order+='────────────────────────────────────────┬─────────┬─────────┬─────────┬─────────┤\n'
	order+='Название                                │   Цена  │  Кол-во │  Скидка │  Сумма  │\n'
	order+='────────────────────────────────────────┼─────────┼─────────┼─────────┼─────────┤\n'



for (let i=0; i<itemList.length; ++i)	
{if (parseFloat(document.getElementById(itemList[i]+"_sum_k_opl").innerHTML ))
	{

//Разбитваем название на куски не более 40символов длиной
    let item_name=document.getElementById(itemList[i]+"_name").innerText;
	item_name=item_name.replace('&nbsp;', ' ');
	item_name=item_name.replace('<b>', '');
	item_name=item_name.replace('</b>', '');
	let temp_name=item_name.split(' ');
	item_name=temp_name[0];
	let last_string=item_name; 
	let add_string='';
	for (let i=1; i<temp_name.length; i++) 
	{	
		add_string='';
		if (last_string.length+temp_name[i].length>=40) 
		{
			
			for (let j=1; j<=40-last_string.length; j++){add_string+=' '}; // Добавляем пробелы
			
			add_string+='│         │         │         │         │\n';
			last_string=temp_name[i];
			item_name+=add_string+temp_name[i];
		}
		else 
		{
			last_string+=' '+temp_name[i];
			item_name+=' '+temp_name[i];
			
		}	
			
	}
	
	
	//Добавляем в последнюю строку пробелы, чтобы не съезжало
	let len_last_string=item_name.length-item_name.lastIndexOf('\n'); //Находим длину порследнего фрагмента 
	for (let i=0; i<(41-len_last_string); i++) {item_name+=' '};
	
	order+=item_name+'│'; 
	
	//цена
	let base_price=document.getElementById(itemList[i]+"_base_price").innerText;
	
	let base_price_length=base_price.length;
		space_before=Math.floor((9-base_price_length)/2);
		space_after=9-base_price_length-space_before;
	for (let i=0; i<space_before; i++) {base_price=' '+base_price};
	for (let i=0; i<space_after; i++) {base_price+=' '};
	base_price+='│';
		
	order+=base_price;  
	
	//количество
	let input_count=document.getElementById(itemList[i]+"_input_count").value;
	
	let input_count_length=input_count.length;
		space_before=Math.floor((9-input_count_length)/2);
		space_after=9-input_count_length-space_before;
	for (let i=0; i<space_before; i++) {input_count=' '+input_count};
	for (let i=0; i<space_after; i++) {input_count+=' '};
    order+=input_count+'│';  
	
	//скидка
	let sum_disc=document.getElementById(itemList[i]+"_sum_disc").innerHTML.trim();
	let sum_disc_length=sum_disc.length;
		space_before=Math.floor((9-sum_disc_length)/2);
		space_after=9-sum_disc_length-space_before;
	for (let i=0; i<space_before; i++) {sum_disc=' '+sum_disc};
	for (let i=0; i<space_after; i++) {sum_disc+=' '};

	
	order+=sum_disc+'│';  
	
	//скидка
	let sum_k_opl=document.getElementById(itemList[i]+"_sum_k_opl").innerHTML.trim();
	let sum_k_opl_length=sum_k_opl.length;
		space_before=Math.floor((9-sum_k_opl_length)/2);
		space_after=9-sum_k_opl_length-space_before;
	for (let i=0; i<space_before; i++) {sum_k_opl=' '+sum_k_opl};
	for (let i=0; i<space_after; i++) {sum_k_opl+=' '};

	order+=sum_k_opl+'│\n';  //сумма к оплате
	order+='────────────────────────────────────────┼─────────┼─────────┼─────────┼─────────┤\n'
	       

}	/*if*/
} /*For*/
let total_sum=document.getElementById("totalSum").innerHTML.trim(); //получаем общую сумму счета
let total_sum_length=total_sum.length;
	space_before=Math.floor((9-total_sum_length)/2);
	space_after=9-total_sum_length-space_before;
for (let i=0; i<space_before; i++) {total_sum=' '+total_sum};
for (let i=0; i<space_after; i++) {total_sum+=' '};



order+='Сумма к оплате:                         │         │         │         │'+total_sum+'│\n';
order+='────────────────────────────────────────┴─────────┴─────────┴─────────┴─────────┘\n';
	
order=order.replace('&nbsp;', ' ');
order=order.replace('&ndash;', '-');
order=order.replace('&mdash;', '-');

    var eml='&eml=zakaz@energetika.by'
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../stat/ord.php?timeStamp=" + new Date().getTime(), true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send("a="+order+eml);
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






