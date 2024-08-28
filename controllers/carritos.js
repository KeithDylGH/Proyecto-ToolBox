const express = require('express');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize');

const carritoRouter = express.Router();

//Agregar producto
carritoRouter.post('/add', authorize(['user', 'admin', 'boss']), async (req, res) => {
    console.log('Sesión de usuario en /add:', req.session.user);
    const { productoId, cantidad = 1 } = req.body;
    const usuarioId = req.session.user ? req.session.user.id : null;

    if (!usuarioId) {
        console.log('Usuario no autenticado en /add');
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    try {
        let carrito = await Carrito.findOne({ usuarioId }).populate('productos.productoId');

        if (!carrito) {
            carrito = new Carrito({ usuarioId, productos: [] });
        }

        const productoIndex = carrito.productos.findIndex(p => p.productoId.toString() === productoId);

        if (productoIndex > -1) {
            carrito.productos[productoIndex].cantidad += cantidad;
        } else {
            const producto = await Producto.findById(productoId);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            carrito.productos.push({ productoId, cantidad });
        }

        await carrito.save();

        res.status(200).json({
            mensaje: 'Producto añadido al carrito exitosamente',
            carrito: carrito.productos.map(p => ({
                nombre: p.productoId.nombre,
                imagen: p.productoId.imagen,
                cantidad: p.cantidad,
                precio: p.productoId.precio  // Incluye el precio del producto
            }))
        });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener productos del carrito, requiere autorización de usuario
carritoRouter.get('/', authorize(['user', 'admin', 'boss']), async (req, res) => {
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

// Eliminar un producto del carrito, requiere autorización de usuario
carritoRouter.delete('/remove/:productoId', authorize(['user', 'admin', 'boss']), async (req, res) => {
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

carritoRouter.post('/vaciar', authorize(['user', 'admin', 'boss']), async (req, res) => {
    const usuarioId = req.session.user ? req.session.user.id : null;

    if (!usuarioId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    try {
        let carrito = await Carrito.findOne({ usuarioId });

        if (carrito) {
            carrito.productos = [];
            await carrito.save();
            res.status(200).json({ mensaje: 'Carrito vacío exitosamente' });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = carritoRouter;