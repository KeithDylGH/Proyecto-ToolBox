const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    imagen: {
        data: String, // URL de la imagen en Bunny Storage
        contentType: String
    },
    categoria: String,
    descripcion: String
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;