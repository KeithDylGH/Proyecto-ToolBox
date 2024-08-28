const express = require('express');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize'); // Asegurando que solo usuarios autenticados accedan a estas rutas

const carritoRouter = express.Router();

// Añadir un producto al carrito
carritoRouter.post('/add', async (req, res) => {
    const { productoId, cantidad } = req.body;
    const usuarioId = req.session.user.id;

    try {
        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            carrito = new Carrito({ usuarioId, productos: [] });
        }

        const productoIndex = carrito.productos.findIndex(p => p.productoId.toString() === productoId);

        if (productoIndex > -1) {
            carrito.productos[productoIndex].cantidad += cantidad;
        } else {
            carrito.productos.push({ productoId, cantidad });
        }

        await carrito.save();
        res.status(200).json({ message: 'Producto añadido al carrito exitosamente' });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener productos del carrito
carritoRouter.get('/', async (req, res) => {
    const usuarioId = req.session.user.id;

    try {
        const carrito = await Carrito.findOne({ usuarioId }).populate('productos.productoId');
        res.status(200).json(carrito);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar un producto del carrito
carritoRouter.delete('/remove/:productoId', async (req, res) => {
    const { productoId } = req.params;
    const usuarioId = req.session.user.id;

    try {
        const carrito = await Carrito.findOne({ usuarioId });

        carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== productoId);
        await carrito.save();

        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = carritoRouter;