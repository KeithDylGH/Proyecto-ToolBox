// usuarios.js
const express = require('express');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
const User = require('../models/usuario'); // Importar el modelo de usuario

const userRouter = express.Router();

// Endpoint para registrar un nuevo usuario
userRouter.post('/registrar', async (req, res) => {
    const { nombre, apellido, usuario, correo, password, numero, cedula } = req.body;

    try {
        // Verificar si todos los campos obligatorios están presentes
        if (!nombre || !apellido || !usuario || !correo || !password || !numero || !cedula) {
            res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Verificar si ya existe un usuario con el mismo nombre de usuario o correo electrónico
        const existingUser = await User.findOne({ $or: [{ usuario }, { correo }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario o correo electrónico ya registrado.' });
        }

        // Hash de la contraseña antes de guardar el usuario
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new User({
            nombre,
            apellido,
            usuario,
            correo,
            password: hashedPassword,
            numero,
            cedula,
            rol: req.body.rol || 'user'
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        res.status(201).json({ mensaje: 'Usuario creado correctamente' });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint para realizar login
userRouter.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        if (!usuario || !password) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
        }

        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }

        const passwordCorrecto = await bcrypt.compare(password, user.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }

        req.session.user = {
            id: user._id,
            nombre: user.nombre,
            usuario: user.usuario,
            rol: user.rol
        };

        let redirectUrl;
        switch (user.rol) {
            case 'admin':
                redirectUrl = '/admin';
                break;
            case 'boss':
                redirectUrl = '/admin';
                break;
            default:
                redirectUrl = '/cliente';
        }

        res.json({ success: true, redirectUrl });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Endpoint para obtener todos los usuarios
userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
});


userRouter.post('/logout', (req, res) => {
    // Aquí puedes destruir la sesión del usuario
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); // o manejar el error como desees
        }
        res.clearCookie('connect.sid'); // opcional, dependiendo de cómo manejes las cookies
        res.redirect('/login'); // redirige a la página de inicio de sesión después de cerrar sesión
    });
});


module.exports = userRouter;
