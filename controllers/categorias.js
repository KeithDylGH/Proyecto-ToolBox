const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoria');

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.render('account/cuenta/admin/category', { categorias });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// Agregar una categoría
router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body;
        const ultimaCategoria = await Categoria.findOne().sort({ numero: -1 });
        const nuevoNumero = ultimaCategoria ? ultimaCategoria.numero + 1 : 1;

        const nuevaCategoria = new Categoria({ nombre, numero: nuevoNumero });
        await nuevaCategoria.save();

        res.redirect('/inventario/categoria?success=Categoría agregada con éxito');
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar categoría' });
    }
});

// Actualizar una categoría
router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { _method } = req.body;

        if (_method === 'PUT') {
            const { nombre } = req.body;
            const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { nombre }, { new: true });
            if (!categoriaActualizada) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.redirect('/inventario/categoria?success=Categoría actualizada con éxito');
        } else if (_method === 'DELETE') {
            const categoriaEliminada = await Categoria.findByIdAndDelete(id);
            if (!categoriaEliminada) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.redirect('/inventario/categoria?success=Categoría eliminada con éxito');
        } else {
            res.status(400).json({ error: 'Método no soportado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

module.exports = router;