require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const ejs = require('ejs');
const Excel = require('exceljs');
const PDF = require('pdfkit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const userRouter = require('./controllers/usuarios');
const productoRouter = require('./controllers/productos');
const loginRouter = require('./controllers/log-in');
const CUsuario = require('./models/usuario');
const iProducto = require('./models/producto');
const fetch = require('node-fetch'); // Asegúrate de instalar este paquete

const app = express();
const PORT = process.env.PORT || 4000;
const mongoUri = process.env.mongoURL;

// Conectar con la base de datos
mongoose.connect(mongoUri).then(() => {
    console.log('Base de Datos conectada!');

    mongoose.connection.once('open', async () => {
        try {
            await CUsuario.deleteMany({});
            console.log('Colección usuarios limpia.');

            const filePath = path.join(__dirname, 'db.json');
            const data = fs.readFileSync(filePath, 'utf-8');
            const parsedData = JSON.parse(data);

            if (!Array.isArray(parsedData.usuarios)) {
                throw new Error('El formato del archivo db.json es incorrecto');
            }

            const users = parsedData.usuarios;

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

            console.log('Datos importados correctamente.');

        } catch (error) {
            console.error('Error al importar datos:', error);
        } finally {
            mongoose.connection.close();
        }
    });

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
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoUri }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para exponer el usuario en res.locals
app.use((req, res, next) => {
    console.log('Session user:', req.session.user);
    if (req.session.user) {
        res.locals.CUsuario = req.session.user;
    } else {
        res.locals.CUsuario = null;
    }
    next();
});

//RUTAS DE FRONTEND (EJS)
app.get('/', (req, res) => {
    const CUsuario = req.session.user;
    res.render('home/index', { CUsuario });
});

app.use('/login', express.static(path.resolve(__dirname, 'views', 'account', 'login')));

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.use('/registrar', express.static(path.resolve(__dirname, 'views', 'account', 'register')));

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

app.get('/cuenta/configuracion/cambiar-datos', (req, res) => {
    res.render('account/cuenta/cliente/configuracion/datos');
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
        res.render('account/cuenta/admin/seeP', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

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

// DESCARGAR FORMATO PDF O EXCEL
app.get('/inventario/descargarInv', async (req, res) => {
    try {
        const productos = await iProducto.find();
        res.render('account/cuenta/admin/pdfYExcel', { productos });
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

            const logoPath = path.join(__dirname, 'public', 'img', 'logo', 'LogoLetra.png');
            doc.image(logoPath, 50, 50, { width: 100 });

            doc.font('Helvetica-Bold').fontSize(18).text('Lista de Productos', {
                align: 'right',
                underline: true,
                margin: 50
            });

            doc.moveDown();

            doc.font('Helvetica').fontSize(12).fillColor('#333');
            productos.forEach(producto => {
                doc.text(`Nombre: ${producto.nombre}`);
                doc.text(`Precio: ${producto.precio}`);
                doc.text(`Categoría: ${producto.categoria}`);
                doc.text(`Descripción: ${producto.descripcion}`);
                doc.moveDown();
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');
            doc.pipe(res);
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

// Middleware para el manejo de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para recibir la URL de la imagen y datos del producto
app.post('/api/productos/agregar', async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion, imagenUrl } = req.body;

        if (!nombre || !precio || !categoria || !descripcion || !imagenUrl) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoProducto = new iProducto({
            nombre,
            precio,
            categoria,
            descripcion,
            imagenUrl // Guarda la URL de la imagen en el producto
        });

        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

app.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;
    
    const usuarioEncontrado = await buscarUsuarioPorNombre(usuario);
  
    if (usuarioEncontrado && await bcrypt.compare(contrasena, usuarioEncontrado.contrasena)) {
        req.session.user = {
            id: usuarioEncontrado._id,
            nombre: usuarioEncontrado.nombre,
            rol: usuarioEncontrado.rol
        };
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// RUTAS DE BACKEND
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/products', productoRouter);

module.exports = app;