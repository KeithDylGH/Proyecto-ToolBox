const mongoose = require('mongoose');

// Definir el esquema del usuario
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true,
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: true
    },
    cedula:{
        type: String,
        required: true,
        unique: true
    },
    rol: {
        type: String,
        default: true
    }
});


// Opcional: configurar opciones adicionales del esquema
usuarioSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convierte _id a una cadena id
        delete returnedObject._id; // Elimina el campo _id
        delete returnedObject.__v; // Elimina el campo __v si lo deseas
    }
});

// Crear el modelo de usuario a partir del esquema
const CUsuario = mongoose.model('CUsuario', usuarioSchema);

// Exportar el modelo para poder usarlo en otras partes de la aplicación
module.exports = CUsuario;