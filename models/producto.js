const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);