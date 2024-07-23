const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { buscarUsuarioPorCorreo, buscarUsuarioPorNombre } = require('./buscarUsuario');
const session = require('express-session');

// Iniciar sesión
router.post('/', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await buscarUsuarioPorCorreo(correo);

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = {
                username: user.nombre,
                role: user.rol
            };
            console.log('Sesión iniciada:', req.session.user); // Verificar en la consola del servidor
            res.redirect('/'); // Redirige a la página principal o donde prefieras
        } else {
            console.log('Correo o contraseña incorrectos');
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
