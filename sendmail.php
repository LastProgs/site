<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail-> CharSer = 'UTF-8';
$mail-> setLanguage('ru', 'PHPMailer-master/language');
$mail-> isHTML(true);

//от кого письмо
$mail->setForm('carev.ilya.24@gmail.com', 'Сайт');
//кому письмо
$mail->setForm('carev.ilya.24@gmail.com');
//тема письма
$mail->Subject = 'Заявка на заказ изделий!';

//тело письма
$body = '<h1>Заказ</h1>';

if (trim(!empty($_POST['name']))){
    $body.='<p><sfotrong>Имя:</sfotrong> '.$_POST['name']. '</p>'
}

if (trim(!empty($_POST['email']))){
    $body.='<p><strong>E-mail:</strong> '.$_POST['email']. '</p>'
}

if (trim(!empty($_POST['number']))){
    $body.='<p><strong>Номер телефона:</strong> '.$_POST['number']. '</p>'
}

if (trim(!empty($_POST['Message']))){
    $body.='<p><strong>Сообщение:</strong> '.$_POST['Message']. '</p>'
}

//прикрепленный файл
if (!empty($_FILES['image']['tmp_name'])){
    //путь загрузки файла
    $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
    //грузим файл
    if (copy($_FILES['image']['tmp_name'], $filePath)){
        $fileAttach = $filePath;
        $body.='<p><strong>Фото в приложении</strong></p>';
        $mail->addAttachment($fileAttach);
    }
}
$mail->Body = $body;

//отправляем
if (!$mail->send()) {
    $message = 'Ошибка'
} else {
    $message = 'Данные отправлены!'
}

$response = ['message' => $message];

header('Content-type: application.json');
echo json_encode($response);
?>