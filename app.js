const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

// Conexión a la base de datos
mongoose.connect('mongodb+srv://keithdyltm:1234@toolbox.medus5t.mongodb.net/?retryWrites=true&w=majority&appName=ToolBox', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Base de Datos conectada!'))
.catch(error => console.log('Error de conexión a la base de datos:', error));

// RUTAS DE FRONTEND
app.use('/', express.static(path.resolve(__dirname, 'views', 'home')));
app.use('/tienda/cabeza', express.static(path.resolve(__dirname, 'views', 'shop', 'Cabeza')));
app.use('/tienda/candados', express.static(path.resolve(__dirname, 'views', 'shop', 'Candados')));
app.use('/tienda/cuerpo', express.static(path.resolve(__dirname, 'views', 'shop', 'Cuerpo')));
app.use('/tienda/escaleras', express.static(path.resolve(__dirname, 'views', 'shop', 'Escaleras')));
app.use('/tienda/herramientas', express.static(path.resolve(__dirname, 'views', 'shop', 'Herramientas')));
app.use('/tienda/luces', express.static(path.resolve(__dirname, 'views', 'shop', 'Luces')));
app.use('/tienda/maquinas', express.static(path.resolve(__dirname, 'views', 'shop', 'Maquinas')));
app.use('/tienda/pinturas', express.static(path.resolve(__dirname, 'views', 'shop', 'Pinturas')));

app.use('/tienda/Log-In', express.static(path.resolve(__dirname, 'views', 'account', 'login')));
app.use('/tienda/Registrar', express.static(path.resolve(__dirname, 'views', 'account', 'register')));
app.use('/tienda/cuenta/admin', express.static(path.resolve(__dirname, 'views', 'account', 'cuenta', 'admin')));
app.use('/tienda/cuenta/cliente', express.static(path.resolve(__dirname, 'views', 'account', 'cuenta', 'cliente')));

// SUPER IMPORTANTE
app.use(express.json());

// RUTAS DE BACKEND
//app.use('/api/users', userRouter);

module.exports = app;
