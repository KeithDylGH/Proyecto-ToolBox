require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const userRouter = require('./controllers/usuarios');
const loginRouter = require('./controllers/log-in');
//const registerRouter = require('./views/account/register/register')

const bcrypt = require('bcryptjs'); // Importar bcrypt para el hashing de contraseñas
const Usuario = require('./models/usuario');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const app = express()
const PORT = process.env.PORT || 4000;
const mongoUrl = process.env.mongoURL;

//conexion a la bd
mongoose.connect(mongoUrl, {
});

mongoose.connection.on('error', (err) => {
    console.error('Error al conectar con MongoDB:', err);
});

mongoose.connection.once('open', async () => {
    console.log('Base de Datos conectada!');

    try {
        // Eliminar todos los documentos existentes en la colección usuarios
        await Usuario.deleteMany({});
        console.log('Colección usuarios limpia.');

        // Leer datos del archivo db.json
        const filePath = path.join(__dirname, 'db.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        if (!Array.isArray(parsedData.usuarios)) {
            throw new Error('El formato del archivo db.json es incorrecto');
        }

        const users = parsedData.usuarios;

        // Hash de contraseñas
        for (let user of users) {
            const existingUser = await Usuario.findOne({ correo: user.correo });
            user.password = await bcrypt.hash(user.password, 10);
            if (existingUser) {
                // Si el usuario ya existe, omitir la inserción
                console.log(`Usuario ${user.correo} ya existe, omitiendo inserción.`);
            } else {
                // Hashing de la contraseña antes de guardar
                user.password = await bcrypt.hash(user.password, 10);
                await Usuario.create(user);
                console.log(`Usuario ${user.correo} insertado correctamente.`);
            }
        }

        // Insertar usuarios en la base de datos
        await Usuario.insertMany(users);
        console.log('Datos importados correctamente.');

    } catch (error) {
        console.error('Error al importar datos:', error);
    } finally {
        mongoose.connection.close();
    }
});

//Servir archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//RUTAS DE FRONTEND
app.use('/',express.static(path.resolve(__dirname, 'views','home')));
app.use('/tienda/cabeza',express.static(path.resolve(__dirname, 'views','shop', 'Cabeza')));

app.use('/login',express.static(path.resolve(__dirname, 'views','account', 'login')));
app.use('/registrar',express.static(path.resolve(__dirname, 'views','account', 'register')));
app.use('/admin',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'admin')));
app.use('/cuenta',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente')));

//SUPER IMPORTANTE
app.use(express.json())

//RUTAS DE BACKEND
app.use('/api/users',userRouter)
app.use('/api/login', loginRouter)

module.exports = app

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor conectado (escuchando) al puerto ${PORT}`);
});