const express = require('express');
const uCarrito = require('../models/carrito');
const iProducto = require('../models/producto');
const router = express.Router();

// Agregar producto al carrito
router.post('/agregar', async (req, res) => {
    const { productoId, cantidad } = req.body;
    const usuarioId = req.session.user._id;

    try {
        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            carrito = new Carrito({ usuarioId, productos: [] });
        }

        const productoExistente = carrito.productos.find(p => p.productoId.equals(productoId));

        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            const producto = await iProducto.findById(productoId);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            carrito.productos.push({ productoId, cantidad });
        }

        await carrito.save();
        res.json({ success: true, message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Obtener productos del carrito
router.get('/', async (req, res) => {
    const usuarioId = req.session.user._id;

    try {
        const carrito = await Carrito.findOne({ usuarioId }).populate('productos.productoId');
        if (!carrito) {
            return res.json({ productos: [] });
        }

        res.json({ productos: carrito.productos });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Eliminar producto del carrito
router.post('/eliminar', async (req, res) => {
    const { productoId } = req.body;
    const usuarioId = req.session.user._id;

    try {
        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carrito.productos = carrito.productos.filter(p => !p.productoId.equals(productoId));

        await carrito.save();
        res.json({ success: true, message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// Vaciar el carrito
router.post('/vaciar', async (req, res) => {
    const usuarioId = req.session.user._id;

    try {
        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carrito.productos = [];

        await carrito.save();
        res.json({ success: true, message: 'Carrito vaciado' });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
});

module.exports = router;
