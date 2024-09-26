const express = require('express');
const router = express.Router();
const Notificacion = require('../models/notificacion');

// Obtener todas las notificaciones
router.get('/', async (req, res) => {
    try {
        const notificaciones = await Notificacion.find().sort({ fecha: -1 }).lean();
        res.json(notificaciones); // Respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).send('Error al obtener notificaciones.');
    }
});

// PATCH para actualizar la notificación
router.patch('/:id', async (req, res) => {
    try {
        const { atendido } = req.body;
        const notificacionActualizada = await Notificacion.findByIdAndUpdate(req.params.id, { atendido }, { new: true });

        if (!notificacionActualizada) {
            return res.status(404).send('Notificación no encontrada.');
        }

        res.status(200).send('Notificación actualizada.');
    } catch (error) {
        console.error('Error al actualizar notificación:', error);
        res.status(500).send('Error al actualizar notificación.');
    }
});

// DELETE para eliminar la notificación
router.delete('/:id', async (req, res) => {
    try {
        const notificacionEliminada = await Notificacion.findByIdAndDelete(req.params.id);

        if (!notificacionEliminada) {
            return res.status(404).send('Notificación no encontrada.');
        }

        res.status(200).send('Notificación eliminada.');
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).send('Error al eliminar notificación.');
    }
});

module.exports = router;