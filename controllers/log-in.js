const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/usuario'); // Asegúrate de importar el modelo correctamente

// Función para iniciar sesión
async function iniciarSesion(usuario, contraseña) {
    try {
        const user = await User.findOne({ usuario });

        if (!user) {
            console.log("No existe el usuario.");
            return { success: false, message: 'Usuario no encontrado' };
        }

        console.log("Contraseña almacenada en la base de datos:", user.password); // Agrega esto para depuración

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

// Ruta para manejar el inicio de sesión
router.post('/', async (req, res) => {
    const { usuario, contraseña } = req.body;
    
    console.log('Datos recibidos:', { usuario, contraseña }); // Agrega esto para depuración

    const result = await iniciarSesion(usuario, contraseña);

    if (result.success) {
        req.session.user = {
            nombre: result.user.nombre,
            usuario: result.user.usuario,
            rol: result.user.rol
        };
        console.log('Sesión iniciada:', req.session.user); 
        res.redirect('/'); 
    } else {
        res.status(400).json({ success: false, message: result.message });
    }
});

// Ruta para manejar el cierre de sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Asegúrate de que el nombre de la cookie sea correcto
        res.redirect('/'); // Redirige a la página principal después del cierre de sesión
    });
});

module.exports = router;