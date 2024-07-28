const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Asegúrate de que el nombre del modelo coincida
const { upload } = require('../app'); // Importa 'upload' desde app.js

// Endpoint para agregar un nuevo producto
router.post('/admin/inventario', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;
        
        const nuevoProducto = new Producto({
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion,
            imagen: req.body.imagen,
        });
        
        await nuevoProducto.save();
        res.status(200).json({ mensaje: 'Producto agregado con éxito' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ mensaje: 'Error al agregar el producto' });
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
router.put('/inventario/editar/:id', upload.single('imagen'), async (req, res) => {
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