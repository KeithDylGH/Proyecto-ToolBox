const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    descripcion: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);


const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Ajusta la ruta según la ubicación de tu modelo

// Ruta para ver productos
router.get('/verproducto', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('account/cuenta/admin/seeP/index', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

module.exports = router;