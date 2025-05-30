<?php 

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;
use Classes\Email;
use Model\Usuario;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function guardar() {
        // Almacena la Cita y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();
        
        $id = $resultado['id'];

        // Almacena la Cita y el Servicio

        // Almacena los Servicios con el ID de la Cita
        
        $idServicios = explode(",", $_POST['servicios']);
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        // Enviar correo de confirmación de cita
        $usuario = Usuario::find($_POST['usuarioId']);
        if($usuario) {
            $email = new Email($usuario->email, $usuario->nombre . ' ' . $usuario->apellido, $usuario->token);
            $email->enviarConfirmacionCita($_POST['fecha'], $_POST['hora']);
        }

        echo json_encode(['resultado' => $resultado]);
        

        // Prueba con Postman
        // echo json_encode($resultado);
    }

    public static function eliminar() {
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }

    public static function citasUsuario() {
        session_start();
        $usuarioId = $_SESSION['id'] ?? null;
        if(!$usuarioId) {
            echo json_encode([]);
            return;
        }
        // Obtener todas las citas del usuario
        $citas = Cita::whereAll('usuarioId', $usuarioId, 'fecha DESC, hora DESC');

        // Obtener los servicios de cada cita
        foreach($citas as &$cita) {
            $cita->servicios = Cita::serviciosPorCita($cita->id);
        }

        echo json_encode($citas);
    }
}