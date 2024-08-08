const express = require('express');
const router = express.Router();
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
require('dotenv').config();

const { bunnyNetPullZone } = process.env;

// Ver carrito
router.get('/ver', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).send('Usuario no autenticado');
        }

        const usuarioId = req.session.user._id;
        const carrito = await Carrito.findOne({ usuarioId }).populate('productos.productoId');

        if (!carrito || carrito.productos.length === 0) {
            return res.render('carrito', { productos: [] });
        }

        const productos = carrito.productos.map(item => ({
            ...item.productoId.toObject(),
            cantidad: item.cantidad,
            imagen: item.productoId.imagen.data
                ? `https://${bunnyNetPullZone}/${item.productoId.imagen.data}`
                : '/img/default.png'
        }));

        res.render('carrito', { productos });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Ruta para agregar un producto al carrito
router.post('/agregar', async (req, res) => {
    const { productoId } = req.body;

    if (!req.session.user) {
        return res.status(401).send('Usuario no autenticado');
    }

    const usuarioId = req.session.user._id;

    try {
        let carrito = await Carrito.findOne({ usuarioId });

        if (!carrito) {
            // Crear un nuevo carrito si no existe
            carrito = new Carrito({ usuarioId, productos: [{ productoId, cantidad: 1 }] });
        } else {
            // Si el carrito ya existe, busca el producto
            const productoEnCarrito = carrito.productos.find(p => p.productoId.equals(productoId));

            if (productoEnCarrito) {
                // Incrementar la cantidad si ya existe en el carrito
                productoEnCarrito.cantidad += 1;
            } else {
                // Agregar un nuevo producto al carrito
                carrito.productos.push({ productoId, cantidad: 1 });
            }
        }

        await carrito.save();
        res.status(200).send('Producto agregado al carrito');
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send('Error al agregar producto al carrito');
    }
});

// Eliminar producto del carrito
router.post('/eliminar', async (req, res) => {
    try {
        const { productoId } = req.body;
        const usuarioId = req.session.user._id;

        const carrito = await Carrito.findOne({ usuarioId });
        if (carrito) {
            carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== productoId);
            await carrito.save();
        }

        res.redirect('/cuenta/carrito');
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).send('Error al eliminar del carrito');
    }
});

// Vaciar carrito FUNCIONA (NO CAMBIAR)
router.post('/vaciar', async (req, res) => {
    try {
        const usuarioId = req.session.user._id;

        await Carrito.findOneAndDelete({ usuarioId });

        res.redirect('/cuenta/carrito');
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).send('Error al vaciar el carrito');
    }
});

module.exports = router;