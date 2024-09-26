// models/Notificacion.js
const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
    usuarioNombre: { type: String, required: true },
    usuarioCorreo: { type: String, required: true },
    usuarioTelefono: { type: String, required: true },
    productos: [{ name: String, price: Number, quantity: Number }],
    total: { type: Number, required: true },
    metodoPago: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notificacion', notificacionSchema);