// controllers/buscarUsuario.js
const CUsuario = require('../models/usuario');

async function buscarUsuarioPorCorreo(correo) {
    try {
        const usuario = await CUsuario.findOne({ correo });
        return usuario;
    } catch (error) {
        throw new Error('Error al buscar usuario por correo');
    }
}

async function buscarUsuarioPorNombre(nombreUsuario) {
    try {
        const usuario = await CUsuario.findOne({ usuario: nombreUsuario });
        return usuario;
    } catch (error) {
        throw new Error('Error al buscar usuario por nombre de usuario');
    }
}

module.exports = {
    buscarUsuarioPorCorreo,
    buscarUsuarioPorNombre
};

