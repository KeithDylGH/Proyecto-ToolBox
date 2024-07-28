const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Asegúrate de que el nombre del modelo coincida

// Endpoint para agregar un nuevo producto
router.post('/admin/inventario', async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;
        
        const nuevoProducto = new Producto({
            nombre,
            precio,
            categoria,
            descripcion,
            imagen
        });
        
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obtener todos los productos
router.get('/admin/inventario', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obtener un producto por su ID
router.get('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para ver productos (esto parece ser un intento previo, asegúrate de cómo deseas manejarla)
router.get('/verproducto', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});

// Endpoint para eliminar un producto por su ID
router.delete('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});

// Endpoint para actualizar un producto
router.put('/inventario/editar/:id', async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, {
            nombre,
            precio,
            categoria,
            descripcion,
            imagen
        }, { new: true });

        if (!productoActualizado) return res.status(404).json({ error: 'Producto no encontrado' });

        res.status(200).json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

module.exports = router;
