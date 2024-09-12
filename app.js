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
const subirProducto = require('./controllers/subirProducto');
const bcrypt = require('bcryptjs');
const Categoria = require('./models/categoria');
const categoriaRouter = require('./controllers/categorias');
const carritoRouter = require('./controllers/carritos');
const CUsuario = require('./models/usuario');
const iProducto = require('./models/producto');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const formData = require('form-data');
const axios = require('axios');
const authorize = require('./middleware/authorize');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4000;
const mongoUri = process.env.mongoURL;

// Configuración de multer para manejar archivos en memoria
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true, // Activa el modo depuración
    logger: true // Registra los mensajes SMTP
});

mongoose.connect(mongoUri).then(() => {
    console.log('Base de Datos conectada!');

    mongoose.connection.once('open', async () => {
        try {
            console.log('Base de datos inicializada.');

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
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    console.log('Session user:', req.session.user);  // Verifica la salida aquí
    res.locals.CUsuario = req.session.user ? req.session.user : null;
    next();
});

app.get('/', async (req, res) => {
    try {
        // Obtener 10 productos aleatorios para la sección de "Te puede interesar"
        const productosParaCarousel = await iProducto.aggregate([{ $sample: { size: 10 } }]);

        // Obtener 4 productos destacados para la sección de "Los mejores productos"
        const productosDestacados = await iProducto.aggregate([{ $sample: { size: 4 } }]);

        // Obtener todas las categorías
        const categorias = await Categoria.find();

        // Seleccionar cuatro categorías aleatorias
        const categoriasSeleccionadas = categorias
            .sort(() => 0.5 - Math.random()) // Mezclar categorías
            .slice(0, 4); // Seleccionar las primeras 4 categorías

        // Obtener un producto destacado para cada categoría
        const categoriasRecomendadas = [];
        for (const categoria of categoriasSeleccionadas) {
            // Buscar productos por ObjectId de categoría
            const productosPorCategoria = await iProducto.find({ categoria: categoria._id }).exec();

            if (productosPorCategoria.length > 0) {
                // Seleccionar un producto aleatorio de la categoría
                const productoDestacado = productosPorCategoria[Math.floor(Math.random() * productosPorCategoria.length)];

                // Construir la URL completa de la imagen para el producto destacado
                if (productoDestacado.imagen && typeof productoDestacado.imagen === 'object' && productoDestacado.imagen.data) {
                    const fileName = productoDestacado.imagen.data.split('/').pop();
                    productoDestacado.imagen.data = `https://${process.env.bunnyNetPullZone}/${fileName}`;
                }

                categoriasRecomendadas.push({
                    ...categoria.toObject(),
                    productoDestacado
                });
            } else {
                // Si no hay productos en la categoría, incluir la categoría sin producto destacado
                categoriasRecomendadas.push({
                    ...categoria.toObject(),
                    productoDestacado: null
                });
            }
        }

        // Construir la URL completa de la imagen para los productos del carrusel y destacados
        [...productosParaCarousel, ...productosDestacados].forEach(producto => {
            if (producto.imagen && typeof producto.imagen === 'object' && producto.imagen.data) {
                const fileName = producto.imagen.data.split('/').pop();
                producto.imagen.data = `https://${process.env.bunnyNetPullZone}/${fileName}`;
            }
        });

        // Obtener el usuario desde la sesión
        const CUsuario = req.session.user;

        // Renderizar la vista con productos generales, categorías recomendadas, todas las categorías y usuario
        res.render('home/index', { CUsuario, productosParaCarousel, productosDestacados, categoriasRecomendadas, categorias });
    } catch (error) {
        console.error('Error al obtener productos y categorías:', error);
        res.status(500).send('Error al obtener productos y categorías');
    }
});

app.get('/buscarProductos', async (req, res) => {
    const { nombre } = req.query;
    try {
        const productos = await iProducto.find({
            nombre: { $regex: nombre, $options: 'i' }  // Busca coincidencias parciales (case-insensitive)
        }).limit(5);  // Limita el número de resultados

        // Construir la URL completa de la imagen para productos encontrados
        productos.forEach(producto => {
            if (producto.imagen && producto.imagen.data) {
                const fileName = producto.imagen.data.split('/').pop();
                producto.imagen.data = `https://${process.env.bunnyNetPullZone}/${fileName}`;
            }
        });

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos' });
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'account', 'cuenta', 'login'));
});

// Ruta para la página de olvidar la contraseña
app.get('/claveOlvidada', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'account', 'clave', 'olvidada'));
});

// Ruta para enviar el correo de restablecimiento de contraseña
app.post('/claveOlvidada', async (req, res) => {
    const { correo } = req.body;
    try {
        const user = await CUsuario.findOne({ correo });
        if (!user) {
            return res.status(400).json({ error: 'No se encontró un usuario con ese correo' });
        }

        // Generar un enlace de restablecimiento de contraseña (esto debería ser más seguro en un entorno de producción)
        const resetToken = Math.random().toString(36).substr(2);
        user.resetToken = resetToken; // Asegúrate de agregar este campo al modelo de usuario
        await user.save();

        const resetLink = `http://localhost:3000/nuevaClave?token=${resetToken}`;

        // Enviar el correo
        await transporter.sendMail({
            from: 'toolboxproyecto@gmail.com',
            to: correo,
            subject: 'Restablecimiento de Contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`
        });

        res.json({ success: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para la página de restablecimiento de contraseña
app.get('/nuevaClave', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'account', 'clave', 'renovar'));
});

// Ruta para manejar la actualización de la contraseña
app.post('/nuevaClave', async (req, res) => {
    const { token, nuevaClave } = req.body;
    try {
        const user = await CUsuario.findOne({ resetToken: token });
        if (!user) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        user.password = await bcrypt.hash(nuevaClave, 10);
        user.resetToken = undefined; // Limpiar el token
        await user.save();

        res.json({ success: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.use('/registrar', express.static(path.resolve(__dirname, 'views', 'account', 'register')));

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.get('/tienda/:categoriaId?', async (req, res) => {
    try {
        const { categoriaId } = req.params;

        // Obtener todas las categorías para el menú de categorías
        const categorias = await Categoria.find();

        // Filtrar productos por categoría si se proporciona el ID de la categoría
        const query = categoriaId ? { categoria: categoriaId } : {}; // Ajusta el campo 'categoria' según tu modelo
        const productos = await iProducto.find(query);

        // Construir la URL completa de la imagen
        productos.forEach(producto => {
            if (producto.imagen && typeof producto.imagen === 'object' && producto.imagen.data) {
                const fileName = producto.imagen.data.split('/').pop();
                producto.imagen.data = `https://${process.env.bunnyNetPullZone}/${fileName}`;
            }
        });

        // Obtener el usuario desde la sesión (esto no afecta la funcionalidad, solo el renderizado)
        const CUsuario = req.session.user;

        // Renderizar la vista con productos, categorías y usuario
        res.render('shop/Catalogo', { CUsuario, productos, categorias });
    } catch (error) {
        console.error('Error al obtener productos y categorías:', error);
        res.status(500).send('Error al obtener productos y categorías');
    }
});

app.get('/tienda/producto/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const producto = await iProducto.findById(productoId);
        const categorias = await Categoria.find(); // Obtener todas las categorías

        if (producto) {
            // Obtener productos aleatorios excluyendo el producto actual
            const randomProducts = await iProducto.aggregate([
                { $match: { _id: { $ne: productoId } } },
                { $sample: { size: 10 } } // Cambia el tamaño según tus necesidades
            ]);

            res.render('shop/Productos', { producto, randomProducts, categorias });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});

// Ruta para la compra de un producto individual
app.get('/compra', async (req, res) => {
    try {
        const productoId = req.query.productoId;
        const cantidad = parseInt(req.query.cantidad, 10) || 1;

        // Verificar si el productoId está presente
        if (!productoId) {
            return res.status(400).send('ID del producto no proporcionado');
        }

        // Obtener el producto desde la base de datos
        const producto = await iProducto.findById(productoId);

        // Verificar si el producto fue encontrado
        if (producto) {
            const total = producto.precio * cantidad;
            res.render('shop/Compra', { producto, cantidad, total });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener el producto');
    }
});

// Ruta para la compra de productos en el carrito
app.get('/comprasCarrito', async (req, res) => {
    try {
        // Verificar si el usuario está autenticado
        const user = req.session.user;
        if (!user) {
            return res.redirect('/'); // Redirigir si el usuario no está autenticado
        }

        // Obtener los productos del carrito desde la base de datos
        const usuario = await CUsuario.findOne({ usuario: user.usuario })
            .populate({
                path: 'carrito.producto',
                populate: {
                    path: 'categoria',
                    select: 'nombre'
                }
            });

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Obtener los productos del carrito
        const carrito = usuario.carrito.map(item => ({
            _id: item.producto._id,
            nombre: item.producto.nombre,
            precio: item.producto.precio,
            imagen: item.producto.imagen,
            cantidad: item.cantidad
        }));

        // Calcular el total del carrito
        const totalCarrito = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);

        // Renderizar la vista con los productos del carrito
        res.render('shop/Compra/compraCarrito', { productos: carrito, totalCarrito });
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).send('Error al obtener los productos del carrito');
    }
});

// Ruta para confirmar el pago
app.post('/confirmar-pago', async (req, res) => {
    const { email, producto, precio, cantidad } = req.body;
    console.log('Recibiendo confirmación de pago para:', email);

    if (!email || !producto || !precio || !cantidad) {
        console.log('Error: Falta información en la solicitud.');
        return res.status(400).send('Faltan datos necesarios para el correo.');
    }

    try {
        // Crear PDF
        const doc = new pdf();
        const pdfPath = 'factura.pdf';

        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(12).text(`Factura de Compra`, { align: 'center' });
        doc.text(`Producto: ${producto}`);
        doc.text(`Precio: $${precio}`);
        doc.text(`Cantidad: ${cantidad}`);
        doc.text(`Total: $${(precio * cantidad).toFixed(2)}`);
        doc.end();

        // Esperar a que el PDF se cree
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Crear y enviar el correo
        const mailOptions = {
            from: 'toolboxproyecto@gmail.com',
            to: email,
            subject: 'Confirmación de Compra',
            text: 'Gracias por tu compra. Adjuntamos tu factura en formato PDF.',
            attachments: [
                {
                    filename: 'factura.pdf',
                    path: pdfPath
                }
            ]
        };

        console.log('Enviando correo...');
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente a', email);

        // Elimina el PDF después de enviarlo
        fs.unlinkSync(pdfPath);

        res.send('Correo enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar correo:', error.message);
        res.status(500).send('Error al enviar el correo.');
    }
});

app.get('/cliente', (req, res) => {
    res.render('account/cuenta/cliente');
});

// Rutas del carrito
app.get('/cuenta/carrito', authorize(['user', 'admin', 'boss']), async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/login');
    }

    try {
        const usuario = await CUsuario.findOne({ usuario: user.usuario }).populate('carrito.producto');
        res.render('account/cuenta/cliente/carrito', { user: usuario }); // Asegúrate de que 'carrito' es el nombre del archivo .ejs
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        res.status(500).send('Error del servidor');
    }
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

app.get('/error', (req, res) => {
    const message = req.query.message || 'Se ha producido un error.';
    res.status(403).render('error/index', { message });
});

app.get('/admin', authorize(['admin', 'boss']), (req, res) => {
    console.log('Usuario autenticado:', req.session.user); // Cambié `req.user` por `req.session.user`
    const CUsuario = req.session.user; // Obtén el usuario de la sesión
    res.render('account/cuenta/admin/index', { CUsuario });
});

app.get('/admin/inventario', authorize(['admin', 'boss']), (req, res) => {
    const CUsuario = req.user;
    res.render('account/cuenta/admin/inventory', { CUsuario });
});

// Ruta para la página del BOSS
/* app.get('/jefe', authorize(['boss']), async (req, res) => {
    try {
        // Obtén la lista de usuarios
        const usuarios = await CUsuario.find({});
        res.render('account/cuenta/boss', { usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
}); */

app.get('/jefe/permisos', async (req, res) => {
    try {
        const users = await CUsuario.find();
        res.render('account/cuenta/boss/adminPage', { users, user: req.session.user });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para actualizar el rol del usuario
/* app.post('/jefe/actualizarRol', authorize(['boss']), async (req, res) => {
    try {
        const { userId, rol } = req.body;
        await CUsuario.findByIdAndUpdate(userId, { rol });
        res.redirect('/jefe');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
}); */

app.get('/inventario/agregarproduto', authorize(['admin', 'boss']), async (req, res) => {
    try {
        const categorias = await Categoria.find(); // Obtener categorías
        res.render('account/cuenta/admin/addP', { categorias });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).send('Error al obtener las categorías');
    }
});

app.get('/inventario/verproducto', authorize(['admin', 'boss']), async (req, res) => {
    try {
        const productos = await iProducto.find();
        const categorias = await Categoria.find();
        res.render('account/cuenta/admin/seeP', { productos, categorias });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.get('/inventario/categoria', authorize(['admin', 'boss']), async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.render('account/cuenta/admin/category', { categorias });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).send('Error al obtener las categorías');
    }
});

app.get('/inventario/editar/:id', authorize(['admin', 'boss']), async (req, res) => {
    try {
        const productoId = req.params.id;
        const producto = await iProducto.findById(productoId).exec();
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        // Buscar todas las categorías
        const categorias = await Categoria.find().exec();

        res.render('account/cuenta/admin/seeP/editP/index', { producto, categorias });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/inventario/descargarInv', authorize(['admin', 'boss']), async (req, res) => {
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

// Maneja la subida de productos con imágenes
app.post('/api/productos/agregar', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file; // Cambiado de req.files.imagen a req.file

        // Guarda el archivo en el servidor
        if (imagen) {
            const ruta = path.join(__dirname, 'uploads', imagen.originalname);
            fs.writeFileSync(ruta, imagen.buffer);
        }

        const nuevoProducto = new iProducto({ nombre, precio, categoria, descripcion });
        if (imagen) {
            nuevoProducto.imagen = imagen.originalname; // Guarda el nombre del archivo en el modelo de producto
        }
        await nuevoProducto.save();

        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

app.put('/inventario/editar/:id', upload.single('inputImagen'), async (req, res) => {
    try {
        const producto = await iProducto.findById(req.params.id);

        if (req.file) {
            producto.imagen = await subirImagen(req.file);
        }

        producto.nombre = req.body.nombre;
        producto.precio = req.body.precio;
        producto.categoria = req.body.categoria;
        producto.descripcion = req.body.descripcion;

        await producto.save();
        res.redirect(`/inventario/verproducto/${producto._id}`);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


app.use('/api/products', productoRouter); // Rutas para productos
app.use('/api/upload', subirProducto);   // Rutas para subir productos
app.use('/api/usuarios', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/categorias', categoriaRouter);
app.use('/api/carrito', carritoRouter);

// Middleware de autorización
app.use(authorize(['user', 'admin', 'boss']));