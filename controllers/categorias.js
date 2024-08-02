const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoria');


// Ruta para mostrar la página de categorías
router.get('/categories', async (req, res) => {
    try {
      const categorias = await Categoria.find(); // Obtiene todas las categorías
      res.render('account/cuenta/admin/category/index', { categorias }); // Pasa las categorías a la vista
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las categorías' });
    }
  });

// Obtener todas las categorías
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// Crear una nueva categoría
router.post('/categorias', async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaCategoria = new Categoria({ nombre });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

// Actualizar una categoría
router.put('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { nombre }, { new: true });
    if (!categoriaActualizada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría
router.delete('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);
    if (!categoriaEliminada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;