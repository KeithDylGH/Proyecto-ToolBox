const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    }
});

const iProducto = mongoose.model('Producto', productoSchema);
module.exports = iProducto;