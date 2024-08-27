const express = require('express');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');

const carritoRouter = express.Router();

// Obtener el carrito del usuario actual
carritoRouter.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    try {
        const carrito = await Carrito.findOne({ usuarioId: req.session.user.id }).populate('productos.productoId');
        res.json(carrito);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar producto al carrito
carritoRouter.post('/agregar', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { productoId, cantidad } = req.body;

    try {
        let carrito = await Carrito.findOne({ usuarioId: req.session.user.id });

        if (!carrito) {
            carrito = new Carrito({ usuarioId: req.session.user.id, productos: [] });
        }

        const productoExistente = carrito.productos.find(prod => prod.productoId.toString() === productoId);

        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            carrito.productos.push({ productoId, cantidad });
        }

        await carrito.save();
        res.status(200).json({ mensaje: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Eliminar producto del carrito
carritoRouter.post('/eliminar', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { productoId } = req.body;

    try {
        const carrito = await Carrito.findOne({ usuarioId: req.session.user.id });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carrito.productos = carrito.productos.filter(prod => prod.productoId.toString() !== productoId);

        await carrito.save();
        res.status(200).json({ mensaje: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

module.exports = carritoRouter;