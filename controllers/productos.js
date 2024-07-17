const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Asegúrate de que el nombre del modelo coincida

// Endpoint para agregar un nuevo producto
router.post('/admin/inventario', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
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
        const productos = await Producto.find(); // Utiliza el modelo Producto para obtener productos
        res.render('account/cuenta/admin/seeP/index', { productos }); // Ajusta según tu lógica de renderizado
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
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
router.put('/admin/inventario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, categoria, descripcion } = req.body;

        const productoActualizado = await Producto.findByIdAndUpdate(id, {
            nombre,
            precio,
            categoria,
            descripcion
        }, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(productoActualizado);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
    }
});

module.exports = router;
