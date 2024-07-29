const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    precio: { type: Number, required: true },
    imagen: {
        data: { type: String, required: true },
        contentType: { type: String, required: true }
    },
    categoria: { type: String, required: true },
    descripcion: { type: String, required: true } // Asegúrate de que este campo esté marcado como requerido
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;