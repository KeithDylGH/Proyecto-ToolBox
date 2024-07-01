//1 Definir el router... CRUD
//router: POST,GET,DELETE,UPDATE

const express = require('express');
const bcrypt = require('bcryptjs'); // Importar bcrypt para el hashing de contraseñas
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken para la generación de tokens JWT
const User = require('../models/usuario'); // Importar el modelo de usuario

const userRouter = express.Router();


const cargarUsuarios = () => {
    const filePath = path.join(__dirname, '..', 'db.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data).usuarios;
};

userRouter.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    //cuando ingrese a este metodo es porque lo estoy llamando desde el js del front, relacionado al formulario
    //donde quiero realizar el registro
    
    try {
        // Verificar si el usuario y la contraseña están presentes
        if (!usuario || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const usuarios = cargarUsuarios();

        const user = await usuarios.find(u => u.usuario === usuario);
        if (!user) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }
        
        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const passwordCorrecto = await bcrypt.compare(password, user.password);

        if (!passwordCorrecto) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Generar token JWT
        const token = jwt.sign({
            usuario: user.usuario,
            userId: user._id  // Puedes incluir cualquier otro dato necesario aquí
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });


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
        const Users = await User.find();
    } catch (error) {
        console.log('Error al buscar usuarios', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
});

module.exports = userRouter;