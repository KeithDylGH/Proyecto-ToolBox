const CUsuario = require('../models/usuario');

async function buscarUsuarioPorCorreo(correo) {
    if (!correo) {
        throw new Error('El correo es necesario para buscar el usuario');
    }

    try {
        // Normalizar el correo a minúsculas para evitar problemas de caso
        const usuario = await CUsuario.findOne({ correo: correo.toLowerCase() });
        return usuario;
    } catch (error) {
        console.error('Error al buscar usuario por correo:', error);
        throw error;
    }
}

async function buscarUsuarioPorNombre(nombreUsuario) {
    try {
        const usuario = await CUsuario.findOne({ usuario: nombreUsuario });
        return usuario;
    } catch (error) {
        console.error('Error al buscar usuario por nombre de usuario:', error);
        throw new Error('Error al buscar usuario por nombre de usuario');
    }
}

module.exports = {
    buscarUsuarioPorCorreo,
    buscarUsuarioPorNombre
};