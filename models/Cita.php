<?php

namespace Model;

class Cita extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'citas';
    protected static $columnasDB = ['id', 'fecha', 'hora', 'usuarioId'];

    public $id;
    public $fecha;
    public $hora;
    public $usuarioId;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
        $this->usuarioId = $args['usuarioId'] ?? '';
    }

    public static function serviciosPorCita($citaId) {
        $query = "SELECT s.id, s.nombre, s.precio 
                FROM servicios AS s
                INNER JOIN citasservicios AS cs ON cs.servicioId = s.id
                WHERE cs.citaId = {$citaId}";
        return self::SQLAsociativo($query);
    }
}