const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String,
        required: true,
    },
    imagen: {
        data: {
            type: String,
            required: false
        },
        contentType: {
            type: String,
            required: true
        },
    },
    marca: {
        type: String,  // Nuevo campo
        required: true,
    },
    stockDisponible: {
        type: Number,  // Nuevo campo
        required: true,
        min: 0  // No se permite stock negativo
    }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;