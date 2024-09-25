const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/usuario');

async function iniciarSesion(usuario, contraseña) {
    try {
        const user = await User.findOne({ usuario });

        if (!user) {
            console.log("No existe el usuario.");
            return { success: false, message: 'Usuario no encontrado' };
        }

        console.log("Contraseña almacenada en la base de datos:", user.password);

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

// LOG-IN.js
router.post('/', async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        console.log('Usuario:', usuario);
        console.log('Contraseña:', contraseña);
        const result = await iniciarSesion(usuario, contraseña);

        if (result.success) {
            req.session.user = {
                id: result.user._id, // Asegúrate de incluir esto
                nombre: result.user.nombre,
                apellido: result.user.apellido, // Añadido
                usuario: result.user.usuario,
                correo: result.user.correo,
                numero: result.user.numero, // Añadido
                cedula: result.user.cedula, // Añadido
                rol: result.user.rol
            };
            console.log('Session user set:', req.session.user);
            res.json({ success: true, user: req.session.user });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;