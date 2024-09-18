// usuarios.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/usuario'); // Importar el modelo de usuario
const Carrito = require('../models/carrito'); // Importar el modelo de carrito

const userRouter = express.Router();

// Endpoint para registrar un nuevo usuario
userRouter.post('/registrar', async (req, res) => {
    const { nombre, apellido, usuario, correo, password, numero, cedula } = req.body;

    try {
        // Verificar si todos los campos obligatorios están presentes
        if (!nombre || !apellido || !usuario || !correo || !password || !numero || !cedula) {
            console.log('Campos obligatorios faltantes:', { nombre, apellido, usuario, correo, password, numero, cedula });
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Verificar si ya existe un usuario con el mismo nombre de usuario o correo electrónico
        const existingUser = await User.findOne({ $or: [{ usuario }, { correo }] });
        console.log('Intentando registrar usuario con correo:', correo);
        console.log('Usuario existente:', existingUser);

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
            correo: correo.toLowerCase(), // Asegurarse de guardar el correo en minúsculas
            password: hashedPassword,
            numero,
            cedula,
            rol: req.body.rol || 'user',
        });

        // Guardar el nuevo usuario en la base de datos
        const usuarioGuardado = await newUser.save();
        console.log('Usuario guardado:', usuarioGuardado);

        // Crear nuevo carrito para el usuario recién creado
        const newCarrito = new Carrito({
            usuarioId: usuarioGuardado._id, // Usar el ID del usuario recién creado
            productos: []
        });

        // Guardar el nuevo carrito en la base de datos
        await newCarrito.save();
        console.log('Carrito creado:', newCarrito);

        res.status(201).json({ mensaje: 'Usuario y carrito creados correctamente' });

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
        console.log('Intentando login con usuario:', usuario);
        console.log('Usuario encontrado para login:', user);

        if (!user) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const passwordCorrecto = await bcrypt.compare(password, user.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Guardar los datos del usuario en la sesión
        req.session.user = {
            id: user._id,
            nombre: user.nombre,
            usuario: user.usuario,
            correo: user.correo.toLowerCase(),  // Asegúrate de incluir el correo
            rol: user.rol
        };

        // Después de guardar los datos en la sesión
        console.log('Usuario autenticado y almacenado en sesión:', req.session.user);

        res.json({
            success: true,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint para obtener todos los usuarios
userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find();
        console.log('Usuarios encontrados:', users);
        res.json(users);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
});

// Endpoint para cerrar sesión
userRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/'); // o manejar el error como desees
        }
        res.clearCookie('connect.sid'); // opcional, dependiendo de cómo manejes las cookies
        res.redirect('/login'); // redirige a la página de inicio de sesión después de cerrar sesión
    });
});

// Cambiar rol de un usuario
userRouter.put('/permisos/rol/:id', async (req, res) => {
    const userId = req.params.id;
    const { rol } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (user.rol === 'boss') {
            return res.status(403).json({ success: false, message: 'No puedes cambiar el rol de un usuario con rol Boss' });
        }

        user.rol = rol;
        await user.save();

        res.json({ success: true, message: `Rol cambiado a ${rol}` });
    } catch (error) {
        console.error('Error al cambiar el rol:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Banear a un usuario (eliminar usuario)
userRouter.delete('/permisos/banear/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (user.rol === 'boss') {
            return res.status(403).json({ success: false, message: 'No puedes banear a un usuario con rol Boss' });
        }

        await User.findByIdAndDelete(userId);

        res.json({ success: true, message: 'Usuario baneado correctamente' });
    } catch (error) {
        console.error('Error al banear al usuario:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

module.exports = userRouter;