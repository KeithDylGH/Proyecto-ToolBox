const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/usuario'); // Importar el modelo de usuario
const { buscarUsuarioPorNombre } = require('./buscarUsuarios'); // Asegúrate de que la ruta sea correcta

const userRouter = express.Router();

// Endpoint para registrar un nuevo usuario
userRouter.post('/registrar', async (req, res) => {
    const { nombre, apellido, usuario, correo, password, numero, cedula } = req.body;

    try {
        if (!nombre || !apellido || !usuario || !correo || !password || !numero || !cedula) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const existingUser = await User.findOne({ $or: [{ usuario }, { correo }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario o correo electrónico ya registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const passwordCorrecto = await bcrypt.compare(password, user.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        req.session.user = {
            id: user._id,
            nombre: user.nombre,
            usuario: user.usuario,
            rol: user.rol
        };

        res.status(200).json({ message: 'Inicio de sesión exitoso', user: req.session.user });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
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
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = userRouter;

