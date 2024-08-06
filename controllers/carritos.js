const express = require('express');
const router = express.Router();
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');

// Ver carrito
router.get('/ver', async (req, res) => {
  try {
    const usuarioId = req.session.user._id;
    const carrito = await Carrito.findOne({ usuarioId }).populate('productos.productoId');

    if (!carrito || carrito.productos.length === 0) {
      return res.render('carrito', { productos: [] });
    }

    const productos = carrito.productos.map(item => ({
      ...item.productoId.toObject(),
      cantidad: item.cantidad,
    }));

    res.render('carrito', { productos });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error al obtener el carrito');
  }
});

// Agregar al carrito
router.post('/agregar', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  if (!req.session.user) {
    return res.status(401).json({ error: 'Debe iniciar sesión para agregar productos al carrito.' });
  }

  const { productoId, cantidad = 1 } = req.body;
  const usuarioId = req.session.user._id;

  try {
    let carrito = await Carrito.findOne({ usuarioId });

    if (!carrito) {
      carrito = new Carrito({ usuarioId, productos: [] });
    }

    const productoExistente = carrito.productos.find(p => p.productoId.toString() === productoId);
    if (productoExistente) {
      productoExistente.cantidad += parseInt(cantidad, 10);
    } else {
      carrito.productos.push({ productoId, cantidad });
    }

    await carrito.save();
    res.json({ success: true, message: 'Producto agregado al carrito.' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
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

// Vaciar carrito
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