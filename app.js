require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const userRouter = require('./controllers/usuarios');
const loginRouter = require('./controllers/log-in');
const ejs = require('ejs');

const bcrypt = require('bcryptjs'); // Importar bcrypt para el hashing de contraseñas
const CUsuario = require('./models/usuario');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const app = express()
const PORT = process.env.PORT || 4000;
const mongoUri = process.env.mongoURL;

//conexion a la bd

mongoose.connect(mongoUri).then(() => {
    console.log('Base de Datos conectada!');

    // Operaciones adicionales después de conectar con éxito
    mongoose.connection.once('open', async () => {
        try {
            // Eliminar todos los documentos existentes en la colección usuarios
            await CUsuario.deleteMany({});
            console.log('Colección usuarios limpia.');

            // Leer datos del archivo db.json
            const filePath = path.join(__dirname, 'db.json');
            const data = fs.readFileSync(filePath, 'utf-8');
            const parsedData = JSON.parse(data);

            if (!Array.isArray(parsedData.usuarios)) {
                throw new Error('El formato del archivo db.json es incorrecto');
            }

            const users = parsedData.usuarios;

            // Hash de contraseñas y creación de usuarios
            for (let user of users) {
                const existingUser = await CUsuario.findOne({ correo: user.correo });
                user.password = await bcrypt.hash(user.password, 10);
                if (existingUser) {
                    console.log(`Usuario ${user.correo} ya existe, omitiendo inserción.`);
                } else {
                    await CUsuario.create(user);
                    console.log(`Usuario ${user.correo} insertado correctamente.`);
                }
            }

            // Insertar usuarios en la base de datos
            //await CUsuario.insertMany(users);
            console.log('Datos importados correctamente.');

        } catch (error) {
            console.error('Error al importar datos:', error);
        } finally {
            mongoose.connection.close();
        }
    });

    // Iniciar el servidor solo cuando la conexión a la base de datos es exitosa
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor conectado y escuchando en el puerto ${PORT}`);
    });

}).catch((err) => {
    console.error('Error al conectar con MongoDB:', err);
});

//Servir archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'controllers')));

//CONFIGURAR EJS
app.set('view engine', 'ejs');
app.use('/views', express.static(path.join(__dirname, 'views')));

//RUTAS DE FRONTEND
app.use('/',express.static(path.resolve(__dirname, 'views','home')));
app.use('/tienda',express.static(path.resolve(__dirname, 'views','shop', 'Cabeza')));
app.use('/login',express.static(path.resolve(__dirname, 'views','account', 'login')));
app.use('/registrar',express.static(path.resolve(__dirname, 'views','account', 'register')));
app.use('/admin',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'admin')));
app.use('/cuenta/menu',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente')));
app.use('/cuenta/carrito',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente', 'carrito')));
app.use('/cuenta/configuracion',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente', 'configuracion')));
app.use('/cuenta/contactos',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente', 'contactos')));


app.get('/', async (req, res) => {
    try {
        const usuario = await CUsuario.findOne(); // Puedes agregar condiciones de búsqueda aquí
        
        let data = {
            CUsuario: { nombre: '' }
        };

        if (usuario) {
            data.CUsuario.nombre = usuario.nombre;
        }

        res.render('home', data);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error del servidor');
    }
});


//SUPER IMPORTANTE
app.use(express.json())

//RUTAS DE BACKEND
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)

module.exports = app