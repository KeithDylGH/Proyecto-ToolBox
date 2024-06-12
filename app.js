const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const port = process.env.PORT || 8000

//conexion a la bd
try {
    mongoose.connect('mongodb+srv://keithdyltm:1234@toolbox.3z2lbu7.mongodb.net/?retryWrites=true&w=majority&appName=ToolBox')
    console.log('Base de Datos conectada!')
} catch (error){
    console.log(error)
}

//RUTAS DE FRONTEND
app.use('/',express.static(path.resolve(__dirname, 'views','home')));
app.use('/tienda/cabeza',express.static(path.resolve(__dirname, 'views','shop', 'Cabeza')));
app.use('/tienda/candados',express.static(path.resolve(__dirname, 'views','shop', 'Candados')));
app.use('/tienda/cuerpo',express.static(path.resolve(__dirname, 'views','shop', 'Cuerpo')));
app.use('/tienda/candados',express.static(path.resolve(__dirname, 'views','shop', 'Escaleras')));
app.use('/tienda/herramientas',express.static(path.resolve(__dirname, 'views','shop', 'Herramientas')));
app.use('/tienda/luces',express.static(path.resolve(__dirname, 'views','shop', 'Luces')));
app.use('/tienda/maquinas',express.static(path.resolve(__dirname, 'views','shop', 'Maquinas')));
app.use('/tienda/pinturas',express.static(path.resolve(__dirname,'views','shop', 'Pinturas')));


app.use('/tienda/Log-In',express.static(path.resolve(__dirname, 'views','account', 'login')));
app.use('/tienda/Registrar',express.static(path.resolve(__dirname, 'views','account', 'register')));
app.use('/tienda/cuenta',express.static(path.resolve(__dirname, 'views','account', 'cuenta')));

//SUPER IMPORTANTE
app.use(express.json())

//RUTAS DE BACKEND
//app.use('/api/users',userRouter)

module.exports = app

//Iniciar Servidor
app.listen(port, '0.0.0.0', ()=>{
    console.log(`Servidor conectado (escuchando) al puerto ${port}`)
})