const express = require('express');
const router = express.Router();
const producto = require('../models/producto');

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



app.patch('/inventario/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, categoria, descripcion } = req.body;

        await iProducto.findByIdAndUpdate(id, { nombre, precio, categoria, descripcion });
        res.status(200).json({ message: 'Producto editado con éxito' });
    } catch (error) {
        console.error('Error al editar el producto:', error);
        res.status(500).json({ error: 'Error al editar el producto' });
    }
});

// Ruta para eliminar un producto
app.delete('/inventario/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await iProducto.findByIdAndDelete(id);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
