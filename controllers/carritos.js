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
  const { productoId, cantidad = 1 } = req.body;

  // Verificar si el usuario está autenticado
  if (!req.session.user) {
      console.error('El usuario no está autenticado.');
      return res.status(401).send('Debe iniciar sesión para agregar productos al carrito.');
  }

  const usuarioId = req.session.user._id;

  if (!usuarioId) {
      console.error('El usuario no tiene un ID asociado en la sesión.');
      return res.status(400).send('No se pudo determinar el ID del usuario.');
  }

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
      res.redirect('/cuenta/carrito');
  } catch (error) {
      console.error('Error al agregar al carrito:', error);
      res.status(500).send('Error al agregar al carrito');
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