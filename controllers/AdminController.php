<?php

namespace Controllers;

use Model\AdminCita;
use Model\Servicio;
use MVC\Router;

class AdminController {
    public static function index(Router $router) {
        session_start();

        isAdmin();

        // Obtener los filtros de la URL
        $fecha = $_GET['fecha'] ?? date('Y-m-d');
        $categoria = $_GET['categoria'] ?? '';

        $fechas = explode('-', $fecha);
        if (!checkdate($fechas[1], $fechas[2], $fechas[0])) {
            header('Location: /404');
        }

        // Construir la consulta SQL
        $consulta = "SELECT citas.id, citas.hora, CONCAT(usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= "usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio, servicios.categoria ";
        $consulta .= "FROM citas ";
        $consulta .= "LEFT OUTER JOIN usuarios ON citas.usuarioId = usuarios.id ";
        $consulta .= "LEFT OUTER JOIN citasServicios ON citasServicios.citaId = citas.id ";
        $consulta .= "LEFT OUTER JOIN servicios ON servicios.id = citasServicios.servicioId ";
        $consulta .= "WHERE 1=1 ";

        // Filtrar por fecha si se seleccionó
        if ($fecha) {
            $consulta .= "AND citas.fecha = '${fecha}' ";
        }

        // Filtrar por categoría si se seleccionó
        if ($categoria) {
            $categoria = trim($categoria);
            $consulta .= "AND LOWER(servicios.categoria) = LOWER('${categoria}') ";
        }

        $citas = AdminCita::SQL($consulta);

        // Obtener todas las categorías únicas para el campo de selección
        $categorias = Servicio::obtenerCategorias();

        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha,
            'categorias' => $categorias
        ]);
    }
}