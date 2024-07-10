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


//VER PRODUCTO
app.get('/inventario/verproducto', async (req, res) => {
    try {
        const productos = await iProducto.find();
        res.render('account/cuenta/admin/seeP', { productos }); // Pasa la lista de productos a la plantilla
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.patch('/inventario/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, categoria, descripcion } = req.body;

        await iProducto.findByIdAndUpdate(id, { nombre, precio, categoria, descripcion });
        res.status(200).json({ message: 'Producto editado con éxito' });
    } catch (error) {
        console.error('Error al editar el producto:', error);
        res.status(500).json({ error: 'Error al editar el producto' });
    }
});

// Ruta para eliminar un producto
app.delete('/inventario/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await iProducto.findByIdAndDelete(id);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});





//DESCARGAR FORMATO PDF O EXCEL
app.get('/inventario/descargarInv', (req, res) => {
    res.render('account/cuenta/admin/pdfYExcel');
});

app.get('/inventario/descargar/excel', async (req, res) => {
    try {

        const productos = await iProducto.find();

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Productos');

        res.render('account/cuenta/admin/pdfYExcel', { productos });

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
    } catch (error) {
        console.error('Error al generar el archivo Excel:', error);
        res.status(500).send('Error al generar el archivo Excel');
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


//RUTAS DE FRONTEND
/* app.use('/',express.static(path.resolve(__dirname, 'views','home')));
app.use('/tienda',express.static(path.resolve(__dirname, 'views','shop', 'Cabeza')));
app.use('/login',express.static(path.resolve(__dirname, 'views','account', 'login')));
app.use('/registrar',express.static(path.resolve(__dirname, 'views','account', 'register')));
app.use('/admin',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'admin')));
app.use('/cuenta/menu',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente')));
app.use('/cuenta/carrito',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente', 'carrito')));
app.use('/cuenta/configuracion',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente', 'configuracion')));
app.use('/cuenta/contactos',express.static(path.resolve(__dirname, 'views','account', 'cuenta', 'cliente', 'contactos'))); */





/* app.get('/', async (req, res) => {
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
}); */


//SUPER IMPORTANTE
app.use(express.json())
app.use(express.urlencoded({ extended:true }));



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