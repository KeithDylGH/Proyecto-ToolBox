const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoria');

// Obtener todas las categorías
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

router.post('/categorias', async (req, res) => {
    try {
        const { nombre } = req.body;
        // Obtener el número más alto existente
        const ultimaCategoria = await Categoria.findOne().sort({ numero: -1 });
        const nuevoNumero = ultimaCategoria ? ultimaCategoria.numero + 1 : 1;
        
        const nuevaCategoria = new Categoria({ nombre, numero: nuevoNumero });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar categoría' });
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