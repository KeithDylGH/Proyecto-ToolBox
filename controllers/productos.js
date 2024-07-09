const express = require('express');
const router = express.Router();
const iProducto = require('../models/producto');

router.post('/admin/inventario', async (req, res) => {
    try {
        const nuevoProducto = new iProducto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/admin/inventario', async (req, res) => {
    try {
        const productos = await iProducto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await iProducto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await iProducto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await iProducto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Ruta para ver productos
router.get('/verproducto', async (req, res) => {
    try {
        const productos = await iProducto.find();
        res.render('account/cuenta/admin/seeP/index', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

module.exports = router;
