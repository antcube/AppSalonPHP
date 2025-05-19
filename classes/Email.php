<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {
    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token) {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion() {

        // create una instancia de PHPMailer
        $mail = new PHPMailer();
        
        // Configuración SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '3283cf851c1e27';
        $mail->Password = 'afe9cdd1eba9ce';
    
        // Configurar el contenido del mail
        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $mail->Subject = 'Confirma tu Cuenta';

        // Habilitar HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = '<html>';
        $contenido .= "<p><strong>Hola " . $this->email .  "</strong> Has Creado tu cuenta en App Salón, solo debes confirmarla presionando el siguiente enlace</p>";
        $contenido .= "<p>Presionar aquí: <a href='http://localhost:3000/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a><p>";        
        $contenido .= "<p>Si tú no solicitaste este cambio, puedes ignorar el mensaje</p>";
        $contenido .= '</html>';
        
        $mail->Body = $contenido;

        //Enviar el mail
        $mail->send();

   }

   public function enviarInstrucciones() {
        // create una instancia de PHPMailer
        $mail = new PHPMailer();
        
        // Configuración SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '3283cf851c1e27';
        $mail->Password = 'afe9cdd1eba9ce';
    
        // Configurar el contenido del mail
        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $mail->Subject = 'Reestablece tu contraseña';

        // Habilitar HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre .  "</strong> Has solicitado restablecer tu contraseña, sigue el siguiente enlace.</p>";
        $contenido .= "<p>Presionar aquí: <a href='http://localhost:3000/recuperar?token=" . $this->token . "'>Reestablecer Contraseña</a><p>";        
        $contenido .= "<p>Si tú no solicitaste este cambio, puedes ignorar el mensaje</p>";
        $contenido .= '</html>';
        
        $mail->Body = $contenido;

        //Enviar el mail
        $mail->send();
   }

   public function enviarConfirmacionCita($fecha, $hora) {
        $mail = new PHPMailer();

        // Configuración SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '3283cf851c1e27';
        $mail->Password = 'afe9cdd1eba9ce';

        // Configurar el contenido del mail
        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $mail->Subject = 'Confirmación de Cita en AppSalon';

        // Habilitar HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p>Hola <strong>{$this->nombre}</strong>, tu cita ha sido reservada correctamente.</p>";
        $contenido .= "<p>Fecha: <strong>{$fecha}</strong></p>";
        $contenido .= "<p>Hora: <strong>{$hora}</strong></p>";
        $contenido .= "<p>¡Gracias por confiar en AppSalon!</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        //Enviar el mail
        $mail->send();
   }
}

