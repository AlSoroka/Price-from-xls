<?php

$name=$_POST[a];
$ip=$_SERVER['REMOTE_ADDR'];
$from="enp.by";
$to=$_POST[eml];
$subject = "Order from ".$from;
$message="Ip: ".$ip."\r\n".$name."\r\n";
$boundary = md5(date('r', time()));
$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: " . $from . "\r\n";
$headers .= "Reply-To: " . $from . "\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
$message="
Content-Type: multipart/mixed; boundary=\"$boundary\"

--$boundary
Content-Type: text/plain; charset=\"utf-8\"
Content-Transfer-Encoding: 7bit

$message";





//$fname='../order/'.date("Y-m-d-H-i")."-".rand(0, 1000).'.ord';
$fname='../order/Заказ-'.date("Y-m-d-H-i")."-".rand(0, 1000).'.txt';
$fp = fopen($fname, "w") or die(" не удалось открыть файл");
fwrite($fp, $eml);
fwrite($fp, "Ip: ".$ip);
fwrite($fp, "\n");
fwrite($fp, $name);
// закрываем
fclose($fp);

if (mail($to, $subject, $message, $headers )){
    echo "Сообщение успешно отправлено";  }
 else {
echo "При отправке сообщения возникли ошибки";  }
?>
