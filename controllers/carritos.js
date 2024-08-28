const express = require('express');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize'); // Middleware para autenticación

const carritoRouter = express.Router();

// Ruta para añadir un producto al carrito
carritoRouter.post('/add', async (req, res) => {
    const { productoId, cantidad = 1 } = req.body;
    const usuarioId = req.session.user ? req.session.user.id : null;

    if (!usuarioId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

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

        // Obtener información completa del producto
        const productos = await carrito.populate('productos.productoId').execPopulate();
        res.status(200).json({
            mensaje: 'Producto añadido al carrito exitosamente',
            carrito: productos.productos.map(p => ({
                nombre: p.productoId.nombre,
                imagen: p.productoId.imagen,
                cantidad: p.cantidad
            }))
        });
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
        res.status(200).json({
            productos: carrito.productos.map(p => ({
                nombre: p.productoId.nombre,
                imagen: p.productoId.imagen,
                cantidad: p.cantidad
            }))
        });
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