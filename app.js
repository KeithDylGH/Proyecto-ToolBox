require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const userRouter = require('./controllers/usuarios');
const productoRouter = require('./controllers/productos');
const loginRouter = require('./controllers/log-in');
const ejs = require('ejs');
const Excel = require('exceljs');
const PDF = require('pdfkit');

const bcrypt = require('bcryptjs'); // Importar bcrypt para el hashing de contraseñas
const CUsuario = require('./models/usuario');
const iProducto = require('./models/producto');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express()
const PORT = process.env.PORT || 4000;
const mongoUri = process.env.mongoURL;


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


// Middleware para cookies y sesiones
app.use(cookieParser('tu_secreto_secreto'));
app.use(session({
    secret: 'tu_secreto_secreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        secure: false,
        httpOnly: true
    }
}));


// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//app.use(express.static(path.join(__dirname, 'controllers')));

//RUTAS DE FRONTEND (EJS)
app.get('/', (req, res) => {
    res.render('home/index');
});

app.use('/login',express.static(path.resolve(__dirname, 'views','account', 'login')));

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.use('/registrar',express.static(path.resolve(__dirname, 'views','account', 'register')));

app.get('/tienda', (req, res) => {
    res.render('shop/Catalogo');
});

app.get('/cliente', (req, res) => {
    res.render('account/cuenta/cliente');
});

app.get('/cuenta/carrito', (req, res) => {
    res.render('account/cuenta/cliente/carrito');
});

app.get('/cuenta/configuracion', (req, res) => {
    res.render('account/cuenta/cliente/configuracion');
});

app.get('/cuenta/atencion', (req, res) => {
    res.render('account/cuenta/cliente/atencion');
});

app.get('/admin', (req, res) => {
    res.render('account/cuenta/admin');
});

app.get('/admin/inventario', (req, res) => {
    res.render('account/cuenta/admin/inventory');
});

app.get('/inventario/agregarproduto', (req, res) => {
    res.render('account/cuenta/admin/addP');
});

app.get('/inventario/verproducto', async (req, res) => {
    try {
        const productos = await iProducto.find();
        res.render('account/cuenta/admin/seeP', { productos }); // Pasa la lista de productos a la plantilla
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para servir la página de edición
app.get('/inventario/editar/:id', async (req, res) => {
    try {
        const producto = await iProducto.findById(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('account/cuenta/admin/seeP/editP', { producto });
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});



//DESCARGAR FORMATO PDF O EXCEL
app.get('/inventario/descargarInv', async (req, res) => {
    try {
        const productos = await iProducto.find();
        res.render('account/cuenta/admin/pdfYExcel', { productos }); // Pasa la lista de productos a la plantilla
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para descargar el inventario en formato seleccionado
app.get('/api/descargar-inventario', async (req, res) => {
    const format = req.query.format;

    if (!['pdf', 'excel'].includes(format)) {
        return res.status(400).send('Formato no válido. Use "pdf" o "excel".');
    }

    try {
        const productos = await iProducto.find();

        if (format === 'excel') {
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Productos');

            worksheet.columns = [
                { header: 'Nombre', key: 'nombre', width: 30 },
                { header: 'Precio', key: 'precio', width: 10 },
                { header: 'Categoría', key: 'categoria', width: 20 },
                { header: 'Descripción', key: 'descripcion', width: 50 }
            ];

            productos.forEach(producto => {
                worksheet.addRow(producto);
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=productos.xlsx'
            );

            await workbook.xlsx.write(res);
            res.end();
        } else if (format === 'pdf') {
            const doc = new PDF();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');

            doc.pipe(res);

            doc.fontSize(18).text('Lista de Productos', { align: 'center' });
            doc.moveDown();

            productos.forEach(producto => {
                doc.fontSize(12).text(`Nombre: ${producto.nombre}`);
                doc.text(`Precio: ${producto.precio}`);
                doc.text(`Categoría: ${producto.categoria}`);
                doc.text(`Descripción: ${producto.descripcion}`);
                doc.moveDown();
            });

            doc.end();
        }
    } catch (error) {
        console.error(`Error al generar el archivo ${format.toUpperCase()}:`, error);
        if (!res.headersSent) {
            res.status(500).send(`Error al generar el archivo ${format.toUpperCase()}`);
        }
    }
});

app.get('/inventario/descargar/pdf', async (req, res) => {
    try {
        const productos = await iProducto.find();

        const doc = new PDF();

        res.render('account/cuenta/admin/pdfYExcel', { productos });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');

        doc.pipe(res);

        doc.fontSize(18).text('Lista de Productos', { align: 'center' });
        doc.moveDown();

        productos.forEach(producto => {
            doc.fontSize(12).text(`Nombre: ${producto.nombre}`);
            doc.text(`Precio: ${producto.precio}`);
            doc.text(`Categoría: ${producto.categoria}`);
            doc.text(`Descripción: ${producto.descripcion}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el archivo PDF:', error);
        res.status(500).send('Error al generar el archivo PDF');
    }
});

//SUPER IMPORTANTE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para agregar productos a MongoDB
app.post('/api/productos/agregar', async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion } = req.body;

        const nuevoProducto = new iProducto({ nombre, precio, categoria, descripcion });
        await nuevoProducto.save();

        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

//RUTAS DE BACKEND
app.use('/api/users',userRouter);
app.use('/api/login',loginRouter);
app.use('/api/products', productoRouter);

module.exports = app