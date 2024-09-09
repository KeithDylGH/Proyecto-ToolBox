const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const multer = require('multer');
const axios = require('axios');
const sharp = require('sharp');
require('dotenv').config();

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración de Bunny Storage
const bunnyStorageAPI = `https://${process.env.bunnyNetHOSTNAME}/${process.env.bunnyNetZONE}`;
const bunnyStorageUploadUrl = `https://${process.env.bunnyNetHOSTNAME}/${process.env.bunnyNetZONE}`;
const bunnyAccessKey = process.env.bunnyNetAPIKEY;
const bunnyPullZoneUrl = `https://${process.env.bunnyNetPullZone}`;


// Endpoint para agregar un nuevo producto
router.post('/admin/inventario', async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion, marca, stock } = req.body;

        if (stock < 0) {
            return res.status(400).json({ error: 'El stock no puede ser negativo' });
        }

        const nuevoProducto = new Producto({
            nombre,
            precio,
            categoria,
            descripcion,
            marca,
            stock
        });

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
        productos.forEach(producto => {
            if (producto.imagen && typeof producto.imagen === 'object' && producto.imagen.data) {
                producto.imagen.data = `${process.env.bunnyNetPullZone}/${producto.imagen.data.split('/').pop()}`;
            }
        });
        res.render('account/cuenta/admin/seeP/index', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para eliminar un producto
router.delete('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (producto.imagen && producto.imagen.data) {
            const imagenUrl = producto.imagen.data;
            const imagenNombre = imagenUrl.split('/').pop();
            const deleteUrl = `${bunnyStorageAPI}/${imagenNombre}`;

            try {
                const deleteResponse = await axios.delete(deleteUrl, {
                    headers: {
                        'AccessKey': bunnyAccessKey,
                        'Content-Type': 'application/octet-stream'
                    }
                });

                if (deleteResponse.status !== 200) {
                    throw new Error(`Error al eliminar la imagen: ${deleteResponse.statusText}`);
                }
            } catch (error) {
                console.error('Error al eliminar la imagen:', error.message);
                return res.status(500).json({ message: 'Error al eliminar la imagen de Bunny Storage' });
            }
        }

        await Producto.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ message: 'Hubo un error al eliminar el producto' });
    }
});

// Endpoint para actualizar un producto
router.put('/editar/:id', upload.single('inputImagen'), async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion, marca, stock } = req.body;
        const imagen = req.file;
        const id = req.params.id;

        if (stock < 0) {
            return res.status(400).json({ error: 'El stock no puede ser negativo' });
        }

        const producto = await Producto.findById(id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        producto.nombre = nombre;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.descripcion = descripcion;
        producto.marca = marca;
        producto.stock = stock;

        if (imagen) {
            if (producto.imagen && producto.imagen.data) {
                const imagenUrl = producto.imagen.data;
                const imagenNombre = imagenUrl.split('/').pop();
                const deleteUrl = `${bunnyStorageAPI}/${imagenNombre}`;

                try {
                    await axios.delete(deleteUrl, {
                        headers: {
                            'AccessKey': bunnyAccessKey,
                            'Content-Type': 'application/octet-stream'
                        }
                    });
                } catch (error) {
                    console.error('Error al eliminar la imagen anterior:', error.message);
                    return res.status(500).json({ error: 'Error al eliminar la imagen anterior de Bunny Storage' });
                }
            }

            try {
                const fileName = imagen.originalname.replace(/\.[^/.]+$/, '') + '.webp';
                const fileBuffer = await sharp(imagen.buffer)
                    .webp()
                    .toBuffer();

                const uploadUrl = `${bunnyStorageUploadUrl}/${fileName}`;
                
                await axios.put(uploadUrl, fileBuffer, {
                    headers: {
                        'Content-Type': 'image/webp',
                        'AccessKey': bunnyAccessKey
                    }
                });

                producto.imagen = {
                    data: `${bunnyPullZoneUrl}/${fileName}`,
                    contentType: 'image/webp'
                };

            } catch (error) {
                console.error('Error al subir la nueva imagen:', error.message);
                return res.status(500).json({ error: 'Error al subir la nueva imagen a Bunny Storage' });
            }
        }

        await producto.save();
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error en la actualización del producto:', error.message);
        res.status(500).json({ error: 'Error en la actualización del producto' });
    }
});

module.exports = router;