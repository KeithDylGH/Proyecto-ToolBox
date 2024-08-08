const express = require('express');
const Carrito = require('../models/carrito');
const iProducto = require('../models/producto');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; // Asegúrate de importar esto

router.post('/agregar', async (req, res) => {
    console.log('Request body:', req.body); // Agregar este registro
    const { productoId, cantidad } = req.body;
    const usuarioId = req.session.user ? req.session.user._id : null;

    if (!usuarioId) {
        return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    try {
        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            carrito = new Carrito({ usuarioId, productos: [] });
        }

        const productoIdObj = ObjectId(productoId);
        const productoExistente = carrito.productos.find(p => p.productoId.equals(productoIdObj));

        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            const producto = await iProducto.findById(productoIdObj);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            carrito.productos.push({ productoId: productoIdObj, cantidad });
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
