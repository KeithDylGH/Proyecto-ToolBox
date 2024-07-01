require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const userRouter = require('./controllers/usuarios');
const loginRouter = require('./controllers/log-in');

const bcrypt = require('bcryptjs'); // Importar bcrypt para el hashing de contraseñas
const Usuario = require('./models/usuario');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const app = express()
const PORT = process.env.PORT || 4000;
const mongoUrl = process.env.mongoURL;

//conexion a la bd
mongoose.connect(mongoUrl, {
    //useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
    console.error('Error al conectar con MongoDB:', err);
});

mongoose.connection.once('open', async () => {
    console.log('Base de Datos conectada!');

    try {
        //leer datos del db.sjon
        const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8');
        const parsedData = JSON.parse(data)

        if(!Array.isArray(parsedData.usuarios)){
            throw new Error('El formato del archivo db es incorrecto')
        }

        const users = parsedData.usuarios

        //hashing password
        for (let user of users){
            user.password = await bcrypt.hash(user.password, 10);
        }

        await Usuario.insertMany(users);
        console.log('Datos importador correctamente');
    } catch (error){
        console.log('Error al importar' ,error)
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