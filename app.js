const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

//conexion a la bd
try {
    mongoose.connect('mongodb+srv://keithdyltm:1234@toolbox.3z2lbu7.mongodb.net/?retryWrites=true&w=majority&appName=ToolBox')
    console.log('Base de Datos conectada!')
} catch (error){
    console.log(error)
}

//RUTAS DE FRONTEND
app.use('/',express.static(path.resolve('views','home')))


//SUPER IMPORTANTE
app.use(express.json())

module.exports = app