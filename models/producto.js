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
        type: String, // Almacena la URL de la imagen como una cadena
        required: false // No es necesario que sea requerido si no siempre hay una imagen
    },    
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;