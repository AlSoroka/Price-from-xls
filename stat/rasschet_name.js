function inputDate (tag_id){
	var date = new Date();
	var monthes = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	var day = date.getDate();
    var month = monthes[date.getMonth()];
    var year = date.getFullYear();
	var dat_today='«' + day + '» ' + month + ' ' + year + ' г.';
	document.getElementById(tag_id).innerHTML = dat_today ;
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
function sum_calculate(book_count)
// Цену читаем из счета - id="base_price"
 {	var base_price=(document.getElementById("base_price").innerHTML);
	base_price = parseFloat(base_price.replace(',', '.'));
	if(!book_count.match('^[0-9]+$')|| book_count==0)
	{alert('Введите нужное Вам количество книг (целое число)');
	document.getElementById("input_count").focus();
	return}
	
	var sum_contract; // Сумма счета цифрами
	var disc=0; // Сумма скидки цифрами
	var disc_str=''; // Сумма скидки словами
	var sum_str=''; // Сумма счета словами
	
	var count= (book_count>0) ? book_count: book_count=-book_count;
	var base_sum=sum_contract=count*base_price;
		sum_contract=count*base_price;
	
	
	
	var count= (book_count>0) ? book_count: book_count=-book_count;
	if ((count>9)&&(count<50)) {
		sum_contract=count*Math.round(base_price*85)/100;
		disc=base_sum-sum_contract;
		disc_str="<br> <span id='disc' style='color:red;'> <b>Cкидка</b> (15%): "+disc.toFixed(2)+" руб. </span>"; }
	else if ((count>49)&&(count<100)) {
		sum_contract=count*Math.round(base_price*75)/100;
		disc=base_sum-sum_contract;
		disc_str="<br> <span id='disc' style='color:red;'> <b>Cкидка</b> (25%): "+disc.toFixed(2)+" руб.</span>"; }	
	else if (count>99){	
		sum_contract=count*Math.round(base_price*65)/100;
		disc=base_sum-sum_contract;
		disc_str="<br> <span id='disc' style='color:red;'> <b>Cкидка</b>  (35%): "+disc.toFixed(2)+" руб.</span>"; }
	
	sum_str="<b>Сумма к оплате</b>: "+ sum_contract.toFixed(2)+" руб. ("+number_to_string(sum_contract)+")."+disc_str;
	document.getElementById("input_count").backgroundColor ="#F7F7F7";
	if (disc>0) {
		document.getElementById("is_sum_disc").innerHTML = "Скидка, <br>руб.";
		document.getElementById("sum_disc").innerHTML = disc.toFixed(2);	
		document.getElementById("skidki").innerHTML = '';
		
		}
	else {	
		document.getElementById("is_sum_disc").innerHTML = "Сумма <br>НДС, руб.";
		document.getElementById("sum_disc").innerHTML = "&mdash;";	
		}
	document.getElementById("sum_k_opl").innerHTML = sum_contract.toFixed(2);
	document.getElementById("tip_note").style.visibility="hidden" ;
	if (book_count>9) 
		{document.getElementById("skidki").style.visibility="hidden"} 
	else 
		{document.getElementById("skidki").style.visibility="visible"};
	document.getElementById("sum_contract").innerHTML = sum_str ;
	
	
}

function printSchet() {

    var line={};
    var order='';
	
    order+='Счет '+document.getElementById("offert_number").innerHTML+' ';
    order+='от '+document.getElementById("offert_dat").innerHTML+'\n';
	order+='Заказчик: '+document.getElementById("custumer_name").innerHTML+'\n';
	order+='УНП: '+document.getElementById("custumer_unp").innerHTML+'\n';
	
	order+='────────────────────────────────────────┬─────────┬─────────┬─────────┬─────────┐\n'
	order+='Название                                │   Цена  │  Кол-во │ Скидка  │  Сумма  │\n'
	order+='────────────────────────────────────────┼─────────┼─────────┼─────────┼─────────┤\n'
    let item_name=document.getElementById("item_name").innerHTML;
//Разбитваем название на куски не более 47 символов длиной
	item_name=item_name.replace('&nbsp;', ' ');
	item_name=item_name.replace('<b>', '');
	item_name=item_name.replace('</b>', '');
	let temp_name=item_name.split(' ');
	item_name=temp_name[0];
	let last_string=item_name; 
	for (let i=1; i<temp_name.length; i++) 
	{
		if (last_string.length+temp_name[i].length>=40) 
		{
			last_string=temp_name[i];
			item_name+='\n'+temp_name[i];
		}
		else 
		{
			last_string+=' '+temp_name[i];
			item_name+=' '+temp_name[i];
			
		}	
			
	}
	
	
	//Добавляем в последнюю строку пробелы, чтобы не съезжало
	let len_last_string=item_name.length-item_name.lastIndexOf('\n');
	for (let i=0; i<(41-len_last_string); i++) {item_name+=' '};
	

	order+=item_name+'│'; 
	
	//цена
	let base_price=document.getElementById("base_price").innerHTML.trim();
	
	let space_before, space_after;
	let base_price_length=base_price.length;
		space_before=parseInt(8-base_price_length)/2;
		space_after=8-base_price_length-space_before;
	for (let i=0; i<space_before; i++) {base_price=' '+base_price};
	for (let i=0; i<space_after; i++) {base_price+=' '};
	base_price+='│';
		
	order+=base_price;  
	
	//количество
	let input_count=document.getElementById("input_count").value;
	
	let input_count_length=input_count.length;
		space_before=parseInt(8-input_count_length)/2;
		space_after=8-input_count_length-space_before;
	for (let i=0; i<space_before; i++) {input_count=' '+input_count};
	for (let i=0; i<space_after; i++) {input_count+=' '};
    order+=input_count+'│';  
	
	//скидка
	let sum_disc=document.getElementById("sum_disc").innerHTML.trim();
	let sum_disc_length=sum_disc.length;
		space_before=parseInt(8-sum_disc_length)/2;
		space_after=8-sum_disc_length-space_before;
	for (let i=0; i<space_before; i++) {sum_disc=' '+sum_disc};
	for (let i=0; i<space_after; i++) {sum_disc+=' '};

	
	order+=sum_disc+'│';  
	
	//скидка
	let sum_k_opl=document.getElementById("sum_k_opl").innerHTML.trim();
	let sum_k_opl_length=sum_k_opl.length;
		space_before=parseInt(8-sum_k_opl_length)/2;
		space_after=8-sum_k_opl_length-space_before;
	for (let i=0; i<space_before; i++) {sum_k_opl=' '+sum_k_opl};
	for (let i=0; i<space_after; i++) {sum_k_opl+=' '};

	order+=sum_k_opl+'│\n';  //сумма к оплате
	order+='────────────────────────────────────────┴─────────┴─────────┴─────────┴─────────┘\n'


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
