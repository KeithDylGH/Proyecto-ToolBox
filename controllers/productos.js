const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const formidable = require('formidable');
const fs = require('fs');
const fetch = require('node-fetch');

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

// Endpoint para actualizar producto
router.put('/inventario/editar/:id', (req, res) => {
    const productId = req.params.id;
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).send('Error en la carga del archivo');

        const { nombre, precio, categoria, descripcion } = fields;
        let imagenUrl = '';

        if (files.inputImagen && files.inputImagen[0]) {
            const image = files.inputImagen[0];
            const imageData = await fs.promises.readFile(image.filepath);
            const response = await fetch('https://storage.bunnycdn.com/your-bucket/' + image.originalFilename, {
                method: 'PUT',
                body: imageData,
                headers: {
                    'Content-Type': image.mimetype
                }
            });
            if (response.ok) {
                imagenUrl = 'https://storage.bunnycdn.com/your-bucket/' + image.originalFilename;
            } else {
                return res.status(500).send('Error al subir la imagen');
            }
        }

        try {
            const productoActualizado = await Producto.findByIdAndUpdate(productId, {
                nombre,
                precio,
                categoria,
                descripcion,
                imagen: imagenUrl
            }, { new: true });

            res.json(productoActualizado);
        } catch (error) {
            res.status(500).send('Error al actualizar el producto');
        }
    });
});

module.exports = router;