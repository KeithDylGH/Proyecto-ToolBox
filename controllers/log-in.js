// controllers/login.js
/* const express = require('express');
const router = express.Router();
const { buscarUsuarioPorNombre } = require('./buscarUsuario'); // Asegúrate de usar la función correcta

async function iniciarSesion(usuario, contraseña) {
    try {
        const user = await buscarUsuarioPorNombre(usuario); // Usa la función correcta

        if (!user) {
            console.log("No existe el usuario.");
            return null;
        }

        if (user.contraseña !== contraseña) {
            console.log("Contraseña incorrecta.");
            return null;
        }

        console.log("Usuario encontrado exitosamente.");
        return user;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return null;
    }
}

router.post('/', async (req, res) => {
    const { usuario, contraseña } = req.body;
    const user = await iniciarSesion(usuario, contraseña);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
});

module.exports = router; */
