const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    imagen: { 
        data: { type: String }, // URL de la imagen en Bunny Storage
        contentType: { type: String } 
    }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;