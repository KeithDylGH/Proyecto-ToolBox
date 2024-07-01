// usuarios.js
const express = require('express');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
const User = require('../models/usuario'); // Importar el modelo de usuario

const userRouter = express.Router();

/* const generateToken = (usuario, userId) => {
    return jwt.sign({
        usuario,
        userId
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}; */

// Endpoint para registrar un nuevo usuario
userRouter.post('/registrar', async (req, res) => {
    const { nombre, usuario, correo, password, numero } = req.body;

    try {
        // Verificar si todos los campos obligatorios están presentes
        if (!nombre || !apellido || !usuario || !correo || !password || !numero || !cedula) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
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
            rol: 'user'
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Generar token JWT para el nuevo usuario
        //const token = generateToken(newUser.usuario, newUser._id);

        res.status(201).json({ token, mensaje: 'Usuario creado correctamente' });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint para realizar login
userRouter.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Verificar si el usuario y la contraseña están presentes
        if (!usuario || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Buscar usuario por nombre de usuario
        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const passwordCorrecto = await bcrypt.compare(password, user.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Generar token JWT para el usuario autenticado
        //const token = generateToken(user.usuario, user._id);

        //res.json({ token });

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

module.exports = userRouter;
