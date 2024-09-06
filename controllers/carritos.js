const express = require('express');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize');
const { buscarUsuarioPorNombre } = require('../controllers/buscarUsuario'); // Verifica la ruta

const carritoRouter = express.Router();

// Agregar al carrito
carritoRouter.post('/add', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = req.session.user;

        console.log('Session user:', user);  // Agrega este log para verificar el contenido de la sesión

        if (!user) {
            console.log('No hay usuario en la sesión.');
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await buscarUsuarioPorNombre(user.usuario);
        console.log('Usuario autenticado:', usuario);  // Agrega este log para verificar el usuario encontrado

        if (!usuario) {
            console.log('Usuario no encontrado:', user.usuario);
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        const productoEnCarrito = usuario.carrito.find(p => p.producto.toString() === productoId);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            usuario.carrito.push({ producto: productoId, cantidad: 1 });
        }

        await usuario.save();

        res.json({
            success: true,
            producto: {
                _id: producto._id,
                nombre: producto.nombre,
                categoria: producto.categoria,
                imagen: producto.imagen,
                cantidad: productoEnCarrito ? productoEnCarrito.cantidad : 1
            }
        });
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

        console.log('Username del usuario en sesión:', user.usuario);
        
        const usuario = await buscarUsuarioPorNombre(user.usuario);
        console.log('Usuario encontrado:', usuario);

        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Usa populate directamente en la consulta
        const usuarioConCarrito = await usuario.populate({
            path: 'carrito.producto',
            model: 'Producto'
        });

        const carrito = usuarioConCarrito.carrito.map(item => ({
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

        console.log('Username del usuario en sesión:', user.usuario);

        const usuario = await buscarUsuarioPorNombre(user.usuario);
        console.log('Usuario encontrado:', usuario);

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

        console.log('Username del usuario en sesión:', user.usuario);

        const usuario = await buscarUsuarioPorNombre(user.usuario);
        console.log('Usuario encontrado:', usuario);

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