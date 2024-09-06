const express = require('express');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize');

const carritoRouter = express.Router();

// Función para buscar usuario por nombre
async function buscarUsuarioPorNombre(nombreUsuario) {
    try {
        const usuario = await Usuario.findOne({ usuario: nombreUsuario });
        return usuario;
    } catch (error) {
        throw new Error('Error al buscar usuario por nombre de usuario');
    }
}

// Agregar al carrito
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

        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = usuario.carrito.find(p => p.producto.toString() === productoId);
        if (productoEnCarrito) {
            // Si ya existe, incrementa la cantidad
            productoEnCarrito.cantidad += 1;
        } else {
            // Si no existe, lo agregamos con cantidad 1
            usuario.carrito.push({ producto: productoId, cantidad: 1 });
        }

        await usuario.save();

        res.json({ success: true, producto: {
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen,
            cantidad: productoEnCarrito ? productoEnCarrito.cantidad : 1
        }});
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Obtener productos del carrito
carritoRouter.get('/getCarrito', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id).populate('carrito.producto');
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const carrito = usuario.carrito.map(item => ({
            _id: item.producto._id,
            nombre: item.producto.nombre,
            categoria: item.producto.categoria,
            imagen: item.producto.imagen,
            cantidad: item.cantidad
        }));

        res.json({ success: true, carrito });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Eliminar un producto del carrito
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

        usuario.carrito = usuario.carrito.filter(p => p.producto.toString() !== productoId);
        await usuario.save();

        res.json({ success: true, message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Vaciar el carrito de compras
carritoRouter.delete('/clear', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        usuario.carrito = [];
        await usuario.save();

        res.json({ success: true, message: 'Carrito vaciado' });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = carritoRouter;