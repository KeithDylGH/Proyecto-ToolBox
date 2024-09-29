const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
    usuarioNombre: { type: String, required: true },
    usuarioCorreo: { type: String, required: true },
    productos: [{ name: String, price: Number, quantity: Number, imagen: String }],
    total: { type: Number, required: true },
    metodoPago: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    atendido: { type: Boolean, default: false } // Campo para estado de atención
});

module.exports = mongoose.model('Notificacion', notificacionSchema);