const express = require('express');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize');

const carritoRouter = express.Router();

// Agregar producto al carrito
carritoRouter.post('/add', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        // Asegúrate de que el carrito sea un array
        if (!Array.isArray(usuario.carrito)) {
            usuario.carrito = [];
        }

        // Verifica si el producto ya está en el carrito
        const productoIndex = usuario.carrito.findIndex(p => p.toString() === productoId);
        if (productoIndex > -1) {
            return res.status(400).json({ success: false, message: 'El producto ya está en el carrito' });
        }

        // Agrega el producto al carrito
        usuario.carrito.push(productoId);
        await usuario.save();

        res.json({ success: true, producto: {
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen // Usa la URL directamente si es un string
        }});
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Obtener productos del carrito, requiere autorización de usuario
carritoRouter.get('/getCarrito', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id).populate('carrito');
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const carrito = usuario.carrito.map(producto => ({
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen // Usa la URL directamente si es un string
        }));

        res.json({ success: true, carrito });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Eliminar un producto del carrito, requiere autorización de usuario
carritoRouter.delete('/remove/:productoId', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const { productoId } = req.params;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Asegúrate de que el carrito sea un array
        if (!Array.isArray(usuario.carrito)) {
            usuario.carrito = [];
        }

        const productoIndex = usuario.carrito.indexOf(productoId);
        if (productoIndex === -1) {
            return res.status(400).json({ success: false, message: 'El producto no está en el carrito' });
        }

        usuario.carrito.splice(productoIndex, 1);
        await usuario.save();

        res.json({ success: true, message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = carritoRouter;