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
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;