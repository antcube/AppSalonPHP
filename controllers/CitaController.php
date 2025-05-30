<?php

namespace Controllers;

use Model\Cita;
use MVC\Router;

class CitaController {
    public static function index( Router $router ) {

        session_start();

        isAuth();

        $usuarioId = $_SESSION['id'];

        // Obtener todas las citas del usuario
        $citas = Cita::whereAll('usuarioId', $usuarioId);

        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id'],
            'citas' => $citas,
        ]);
    }
}