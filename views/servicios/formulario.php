<div class="campo">
    <label for="nombre">Nombre:</label>
    <input 
        type="text"
        id="nombre"
        placeholder="Nombre Servicio"
        name="nombre"
        value="<?php echo $servicio->nombre; ?>"
    />
</div>

<div class="campo">
    <label for="precio">Precio:</label>
    <input 
        type="number"
        id="precio"
        placeholder="Precio Servicio"
        name="precio"
        value="<?php echo $servicio->precio; ?>"
    />
</div>

<div class="campo">
    <label for="categoria">Categoría:</label>
    <select id="categoria" name="categoria">
        <option value="">-- Seleccione --</option>
        <?php foreach ($categorias as $categoria): ?>
            <option value="<?php echo $categoria->categoria; ?>" <?php echo $categoria->categoria == $servicio->categoria ? 'selected' : ''; ?>>
                <?php echo $categoria->categoria; ?>
            </option>
        <?php endforeach; ?>
    </select>
</div>