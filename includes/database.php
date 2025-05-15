<?php

$db = mysqli_connect('localhost', 'root', 'root', 'appsalon_mvc_prueba');


if (!$db) {
    echo "Error: No se pudo conectar a MySQL.";
    echo "errno de depuración: " . mysqli_connect_errno();
    echo "error de depuración: " . mysqli_connect_error();
    exit;
}
