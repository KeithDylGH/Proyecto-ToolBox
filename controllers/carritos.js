const express = require('express');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize');
const CUsuario = require('../models/usuario'); // Asegúrate de que esta sea la ruta correcta para el modelo Usuario

const carritoRouter = express.Router();

// Agregar al carrito
carritoRouter.post('/add', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        console.log('Buscando usuario:', user.usuario); // Log del usuario
        const usuario = await CUsuario.findOne({ usuario: user.usuario });
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        console.log('Buscando producto por ID:', productoId); // Log del producto
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        // Actualizar la cantidad del producto en el carrito
        const index = usuario.carrito.findIndex(p => p.producto.toString() === productoId);
        if (index !== -1) {
            usuario.carrito[index].cantidad += 1;
            console.log(`Actualizando cantidad del producto en el carrito: ${usuario.carrito[index].cantidad}`); // Log de la cantidad
        } else {
            usuario.carrito.push({ producto: productoId, cantidad: 1 });
            console.log('Producto añadido al carrito:', producto); // Log de nuevo producto añadido
        }

        await usuario.save();
        console.log('Carrito actualizado en la base de datos'); // Log del carrito guardado

        res.json({
            success: true,
            producto: {
                _id: producto._id,
                nombre: producto.nombre,
                categoria: producto.categoria,
                imagen: producto.imagen,
                cantidad: usuario.carrito[index]?.cantidad || 1
            }
        });
    } catch (error) {
        console.error('Error al agregar al carrito:', error); // Log de error
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

        console.log('Buscando usuario y cargando carrito para:', user.usuario); // Log del usuario autenticado
        const usuario = await CUsuario.findOne({ usuario: user.usuario }).populate('carrito.producto');
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

        console.log('Productos del carrito devueltos:', carrito); // Log de los productos en el carrito
        res.json({ success: true, carrito });
    } catch (error) {
        console.error('Error al obtener el carrito:', error); // Log de error
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

        console.log('Eliminando producto del carrito. Producto ID:', productoId); // Log del producto a eliminar
        const usuario = await CUsuario.findOne({ usuario: user.usuario });
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Filtrar el carrito para eliminar el producto
        usuario.carrito = usuario.carrito.filter(p => p.producto.toString() !== productoId);
        await usuario.save();
        console.log('Producto eliminado del carrito'); // Log de confirmación

        res.json({ success: true, message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error); // Log de error
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = carritoRouter;