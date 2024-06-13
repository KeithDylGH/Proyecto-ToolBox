const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const userRouter = require('./controllers/usuarios');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const app = express()
const PORT = process.env.PORT || 4000;

//conexion a la bd
try {
    mongoose.connect('mongodb+srv://keithdyltm:1234@toolbox.medus5t.mongodb.net/?retryWrites=true&w=majority&appName=ToolBox')
    console.log('Base de Datos conectada!')
} catch (error){
    console.log(error)
}

//Servir archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//RUTAS DE FRONTEND
app.use('/',express.static(path.resolve(__dirname, 'views','home')));
app.use('/tienda/cabeza',express.static(path.resolve(__dirname, 'views','shop', 'Cabeza')));
app.use('/tienda/candados',express.static(path.resolve(__dirname, 'views','shop', 'Candados')));
app.use('/tienda/cuerpo',express.static(path.resolve(__dirname, 'views','shop', 'Cuerpo')));
app.use('/tienda/escaleras', express.static(path.resolve(__dirname, 'views', 'shop', 'Escaleras')));
app.use('/tienda/herramientas', express.static(path.resolve(__dirname, 'views', 'shop', 'Herramientas')));
app.use('/tienda/luces',express.static(path.resolve(__dirname, 'views','shop', 'Luces')));
app.use('/tienda/maquinas',express.static(path.resolve(__dirname, 'views','shop', 'Maquinas')));
app.use('/tienda/pinturas',express.static(path.resolve(__dirname,'views','shop', 'Pinturas')));


app.use('/Log-In',express.static(path.resolve(__dirname, 'views','account', 'login', 'index.html')));
app.use('/Registrar',express.static(path.resolve(__dirname, 'views','account', 'register', 'index.html')));
app.use('/admin',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'admin')));
app.use('/cuenta',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente')));

//SUPER IMPORTANTE
app.use(express.json())

//RUTAS DE BACKEND
app.use('/api/users',userRouter)

module.exports = app

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor conectado (escuchando) al puerto ${PORT}`);
});