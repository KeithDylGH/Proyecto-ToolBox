const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { buscarUsuarioPorNombre } = require('./buscarUsuario');
const CUsuario = require('../models/usuario'); // Ajusta la ruta según tu estructura de directorios
const session = require('express-session');

/* async function iniciarSesion(usuario, contraseña) {
    try {
        const user = await buscarUsuarioPorNombre(usuario);

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
} */

// Iniciar sesión
router.post('/', async (req, res) => {
    const { correo, password } = req.body;
    const user = await CUsuario.findOne({ correo });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = {
            username: user.nombre,
            role: user.role
        };
        console.log('Sesión iniciada:', req.session.user); // Verificar en la consola del servidor
        res.redirect('/'); // Redirige a la página principal o donde prefieras
    } else {
        res.redirect('/login'); // Redirige al login si el usuario no es válido
    }
});

router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await CUsuario.findOne({ correo });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = {
                username: user.nombre,
                role: user.rol
            };
            console.log('Sesión iniciada:', req.session.user);
            res.redirect('/'); // Redirige a la página principal o donde prefieras
        } else {
            res.redirect('/login'); // Redirige al login si el usuario no es válido
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.redirect('/login');
    }
});



// Cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.redirect('/');
    });
});

module.exports = router;
