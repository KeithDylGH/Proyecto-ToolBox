const express = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = 'secret_key'

// Registrar Usuario
router.post('/register', async (req, res) => {
    // Extraer los datos del usuario del cuerpo de la solicitud
    const { nombre, user, correo, password } = req.body;
    try {
        // Validar si algún campo está vacío
        if (!nombre || !correo || !password || !user) {
            // Retornar un mensaje de error si algún campo está vacío
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Crear un nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            user,
            correo,
            password
        });

        // Guardar el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        // Responder con un mensaje de éxito
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso
        console.error('Error al crear usuario:', error);
        // Responder con un mensaje de error
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

//Ruta para iniciar sesion
router.post('/login', async (req, res)=>{
    const {user, password} = req.body;
    try {
        const usuario = await Usuario.findOne({ user });
        if(usuario && usuario.comparePassword(password)){
            const token = jwt.sign({ id: usuario._id, user: usuario.user }, SECRET_KEY, { expiresIn: '1h'})
            res.json({ message: 'Inicio de sesion exitoso', token });
        }else{
            res.status(401).json({ message: 'Campos invalidos' });
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
