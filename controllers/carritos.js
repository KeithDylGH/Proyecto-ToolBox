const express = require('express');
const router = express.Router();
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');

// Agregar producto al carrito
router.post('/agregar', async (req, res) => {
  const { productoId, cantidad = 1 } = req.body;
  const usuarioId = req.session.user._id; // Asegúrate de obtener el ID del usuario autenticado

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
      res.redirect('/');
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

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
});

// Vaciar carrito
router.post('/vaciar', async (req, res) => {
  try {
    const usuarioId = req.session.user._id;

    await Carrito.findOneAndDelete({ usuarioId });

    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
});

module.exports = router;