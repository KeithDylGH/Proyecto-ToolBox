const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const multer = require('multer');
const axios = require('axios');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

// Endpoint para agregar un nuevo producto
router.post('/admin/inventario', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obtener todos los productos
router.get('/admin/inventario', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obtener un producto por su ID
router.get('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para ver productos
router.get('/verproducto', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('account/cuenta/admin/seeP/index', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Endpoint para eliminar un producto por su ID
router.delete('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});

// Ruta para actualizar un producto
/* router.put('/editar/:id', upload.single('inputImagen'), async (req, res) => {
    console.log('Solicitud PUT recibida para el producto con ID:', req.params.id);
    console.log('Datos recibidos en la solicitud:', req.body);
    console.log('Archivo recibido:', req.file);

    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file; // Cambiado de req.files.imagen a req.file
        const id = req.params.id;

        console.log('Datos procesados:', { nombre, precio, categoria, descripcion, imagen });

        const producto = await Producto.findById(id);
        if (!producto) {
            console.log('Producto no encontrado');
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        producto.nombre = nombre;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.descripcion = descripcion;

        if (imagen) {
            const ruta = path.join(__dirname, '../uploads', imagen.originalname);
            fs.writeFileSync(ruta, imagen.buffer);
            producto.imagen = imagen.originalname;
        }

        await producto.save();
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}); */

module.exports = router;