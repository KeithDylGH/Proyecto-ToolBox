//1 Definir el router... CRUD
//router: POST,GET,DELETE,UPDATE

const express = require('express');
//const bcrypt = require('bcryptjs'); // Importar bcrypt para el hashing de contraseñas
//const jwt = require('jsonwebtoken'); // Importar jsonwebtoken para la generación de tokens JWT
const User = require('../models/usuario'); // Importar el modelo de usuario

const userRouter = express.Router();

//2. registro del nombre que el usuario ingreso en el formulario
userRouter.post('/login', async (req, res) => {
    const { usuario, password, nombre, correo, numero } = req.body;
    //cuando ingrese a este metodo es porque lo estoy llamando desde el js del front, relacionado al formulario
    //donde quiero realizar el registro
    
    try {
        // Verificar si el usuario y la contraseña están presentes
        if (!usuario || !password || !nombre || !correo || !numero) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const newUser = new User({
            nombre,
            correo,
            usuario,
            password,
            numero
        });

        //guardar Usuario
        await newUser.save()

        res.status(201).json({ mensaje: 'Usuario creador correctamente'})

    } catch (error){
        console.log('Error al crear usuario' ,error)

        res.status(500).json({error: 'Error en el servidor'})
    }
});

//obtener los usuario
userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find();
    } catch (error) {
        console.log('Error al buscar usuarios', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
});

module.exports = userRouter;




/* try {
        // Buscar al usuario por su nombre de usuario
        const usuarioEncontrado = await User.findOne({ usuario });

        // Si no se encuentra el usuario
        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Comparar la contraseña ingresada con la contraseña en la base de datos
        const contraseñaValida = await bcrypt.compare(password, usuarioEncontrado.password);

        // Si las contraseñas no coinciden
        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: usuarioEncontrado._id, usuario: usuarioEncontrado.usuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        // Devolver el token como respuesta
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    } */