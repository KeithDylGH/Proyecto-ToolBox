const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { buscarUsuarioPorNombre } = require('./buscarUsuario'); // Asegúrate de usar la función correcta

async function iniciarSesion(usuario, contraseña) {
    try {
        const user = await buscarUsuarioPorNombre(usuario); // Usa la función correcta

        if (!user) {
            console.log("No existe el usuario.");
            return { success: false, message: 'Usuario no encontrado' };
        }

        const passwordCorrecta = await bcrypt.compare(contraseña, user.password);
        if (!passwordCorrecta) {
            console.log("Contraseña incorrecta.");
            return { success: false, message: 'Contraseña incorrecta' };
        }

        console.log("Usuario encontrado exitosamente.");
        return { success: true, user };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return { success: false, message: 'Error en el servidor' };
    }
}

router.post('/', async (req, res) => {
    const { usuario, contraseña } = req.body;
    const result = await iniciarSesion(usuario, contraseña);

    if (result.success) {
        res.json({ success: true, user: result.user });
    } else {
        res.status(400).json({ success: false, message: result.message });
    }
});

module.exports = router;
