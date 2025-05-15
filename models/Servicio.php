<?php 

namespace Model;

class Servicio extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'servicios';
    protected static $columnasDB = ['id', 'nombre', 'precio', 'categoria'];

    public $id;
    public $nombre;
    public $categoria;
    public $precio;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->categoria = $args['categoria'] ?? '';    
        $this->precio = $args['precio'] ?? '';
    }

    public function validar() {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre del Servicio es Obligatorio';
        }
        if(!$this->precio) {
            self::$alertas['error'][] = 'El Precio del Servicio es Obligatorio';
        }
        if(!$this->categoria) {
            self::$alertas['error'][] = 'La Categoria del Servicio es Obligatoria';
        }
        if(!is_numeric($this->precio)) {
            self::$alertas['error'][] = 'El precio no es válido';
        }
        if ($this->precio < 10 || $this->precio > 200) {
            self::$alertas['error'][] = 'El precio debe estar entre 10 y 200 soles';
        }
        return self::$alertas;
    }

    public static function obtenerCategorias() {
        $query = "SELECT DISTINCT categoria FROM servicios";
        return self::SQL($query);
    }
}