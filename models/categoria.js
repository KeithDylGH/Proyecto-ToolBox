const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    numero: {
        type: Number,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;