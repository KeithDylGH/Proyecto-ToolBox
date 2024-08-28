const mongoose = require('mongoose');
const { Schema } = mongoose;

const carritoSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'CUsuario', // referencia al modelo de usuario
        required: true
    },
    productos: [
        {
            productoId: {
                type: Schema.Types.ObjectId,
                ref: 'Producto', // referencia al modelo de producto
                required: true
            },
            cantidad: {
                type: Number,
                default: 1
            }
        }
    ]
});

const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = Carrito;