const express = require('express');
const router = express.Router();
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
require('dotenv').config();

// Ver carrito
router.get('/ver', async (req, res) => {
    try {
        const usuarioId = req.session.user._id;
        const carrito = await Carrito.findOne({ usuarioId }).populate('productos.productoId');

        if (!carrito || carrito.productos.length === 0) {
            return res.render('carrito', { productos: [] });
        }

        const productos = carrito.productos.map(item => ({
            ...item.productoId.toObject(),
            cantidad: item.cantidad,
        }));

        res.render('carrito', { productos });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Agregar al carrito
router.post('/agregar', async (req, res) => {
    try {
        const { productoId } = req.body;
        const producto = await Producto.findById(productoId);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Construir la URL de la imagen usando la variable de entorno
        const imagenUrl = producto.imagen.data 
            ? `https://${process.env.bunnyNetPullZone}/${producto.imagen.data}` 
            : '/img/default.png';

        res.json({
            producto: {
                _id: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: imagenUrl
            }
        });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito' });
    }
});

// Eliminar producto del carrito
router.post('/eliminar', async (req, res) => {
    try {
        const { productoId } = req.body;
        const usuarioId = req.session.user._id;

        const carrito = await Carrito.findOne({ usuarioId });
        if (carrito) {
            carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== productoId);
            await carrito.save();
        }

        res.redirect('/cuenta/carrito');
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).send('Error al eliminar del carrito');
    }
});

// Vaciar carrito
router.post('/vaciar', async (req, res) => {
    try {
        const usuarioId = req.session.user._id;

        await Carrito.findOneAndDelete({ usuarioId });

        res.redirect('/cuenta/carrito');
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).send('Error al vaciar el carrito');
    }
});

module.exports = router;