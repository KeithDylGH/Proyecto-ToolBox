const express = require('express');
const router = express.Router();
const producto = require('../models/producto');

const {
    obtenerProductos,
    obtenerProducto,
    editarProducto,
    eliminarProducto
} = require('./api');

router.post('/admin/inventario', async (req, res) => {
    try {
        const nuevoProducto = new producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/admin/inventario', async (req, res) => {
    try {
        const productos = await producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Ruta para ver productos
router.get('/verproducto', async (req, res) => {
    try {
        const productos = await obtenerProductos(); // Utiliza la función para obtener productos
        res.render('account/cuenta/admin/seeP/index', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para mostrar el formulario de edición de un producto específico
router.get('/inventario/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const producto = await obtenerProducto(id);
        res.render('editP', { producto });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto para editar.');
    }
});

// Ruta para guardar los cambios editados del producto
router.post('/inventario/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, precio, categoria, descripcion } = req.body;
        await editarProducto({ id, nombre, precio, categoria, descripcion });
        res.redirect('/inventario'); // Redirigir a la página de ver productos después de editar
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar los cambios del producto.');
    }
});

// Ruta para eliminar un producto
router.delete('/inventario/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await eliminarProducto(id);
        res.sendStatus(200); // Envía estado 200 para indicar éxito
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el producto.');
    }
});

module.exports = router;