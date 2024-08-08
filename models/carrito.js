const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carritoSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'CUsuario', // Nombre correcto del modelo de usuario
        required: true
    },
    productos: [
        {
            productoId: {
                type: Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            cantidad: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
});

// Crea el modelo a partir del esquema
const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = Carrito;