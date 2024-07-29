require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const userRouter = require('./controllers/usuarios');
const productoRouter = require('./controllers/productos');
const loginRouter = require('./controllers/log-in');
const ejs = require('ejs');
const Excel = require('exceljs');
const PDF = require('pdfkit');
const fileUpload = require('express-fileupload');
const subirProducto = require('./controllers/subirProducto');
const bcrypt = require('bcryptjs');
const CUsuario = require('./models/usuario');
const iProducto = require('./models/producto');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const upload = multer();

const app = express();
const PORT = process.env.PORT || 4000;
const mongoUri = process.env.mongoURL;

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

app.use(cookieParser('tu_secreto_secreto'));
app.use(session({
    secret: 'tu_secreto_secreto',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoUri }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 } // Limita el tamaño del archivo a 10 MB
}));
//app.use(upload.array());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    console.log('Session user:', req.session.user);
    if (req.session.user) {
        res.locals.CUsuario = req.session.user;
    } else {
        res.locals.CUsuario = null;
    }
    next();
});

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

app.get('/inventario/descargarInv', async (req, res) => {
    try {
        const productos = await iProducto.find();
        res.render('account/cuenta/admin/pdfYExcel', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.get('/api/descargar-inventario', async (req, res) => {
    const format = req.query.format;

    if (!['pdf', 'excel'].includes(format)) {
        return res.status(400).send('Formato no válido. Debe ser pdf o excel.');
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
        console.error('Error al generar el archivo:', error);
        res.status(500).send('Error al generar el archivo');
    }
});

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

app.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;
    
    // Aquí deberías buscar el usuario en la base de datos
    const usuarioEncontrado = await buscarUsuarioPorNombre(usuario);
  
    if (usuarioEncontrado && await bcrypt.compare(contrasena, usuarioEncontrado.contrasena)) {
      req.session.user = {
        id: usuarioEncontrado._id,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol
      };
      res.redirect('/'); // Redirige a la página principal o a donde necesites
    } else {
      res.redirect('/login'); // Redirige de vuelta al login en caso de error
    }
});

app.use('/api/productos', productoRouter);
app.use('/api/products', subirProducto);
app.use('/api/usuarios', userRouter);
app.use('/api/login', loginRouter);

app.post('/subir-imagen', async (req, res) => {
    try {
        if (!req.files || !req.files.imagen) {
            return res.status(400).send('No se ha subido ninguna imagen.');
        }

        const archivo = req.files.imagen;
        const ruta = path.join(__dirname, 'uploads', archivo.name);
        await archivo.mv(ruta);

        res.status(200).send('Imagen subida con éxito.');
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).send('Error al subir la imagen.');
    }
});