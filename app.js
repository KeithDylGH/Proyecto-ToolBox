require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const userRouter = require('./controllers/usuarios');
const loginRouter = require('./controllers/log-in');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const app = express()
const PORT = process.env.PORT || 4000;

//conexion a la bd
try {
    mongoose.connect('mongodb+srv://keithdyltm:1234@toolbox.medus5t.mongodb.net/?retryWrites=true&w=majority&appName=ToolBox',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })

    .then(() => console.log('Base de Datos conectada!'))
} catch (error){
    console.log(error)
}

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