const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CUsuario',
    required: true
  },
  productos: [{
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    }
  }]
});

module.exports = mongoose.model('Carrito', carritoSchema);