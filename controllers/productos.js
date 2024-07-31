const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const multer = require('multer');
const axios = require('axios');
const sharp = require('sharp');

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bunnyStorageAPI = `https://storage.bunnycdn.com/${process.env.bunnyNetZONE}/`;

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

// Ruta para eliminar un producto
router.delete('/admin/inventario/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        // Eliminar la imagen de Bunny Storage
        if (producto.imagen && typeof producto.imagen === 'string') {
            const imagenUrl = producto.imagen;
            const imagenNombre = imagenUrl.split('/').pop();
            
            const deleteResponse = await fetch(`${bunnyStorageAPI}${imagenNombre}`, {
                method: 'DELETE',
                headers: {
                    'AccessKey': process.env.bunnyNetAPIKEY,
                },
            });
            
            if (!deleteResponse.ok) {
                throw new Error('Error al eliminar la imagen de Bunny Storage');
            }
        }
        
        // Eliminar el producto de la base de datos
        await Producto.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Hubo un error al eliminar el producto' });
    }
});

// Endpoint para actualizar un producto
router.put('/editar/:id', upload.single('inputImagen'), async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file; // Archivo de imagen recibido
        const id = req.params.id;

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        producto.nombre = nombre;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.descripcion = descripcion;

        // Verificar si se proporciona una nueva imagen
        if (imagen) {
            try {
                const fileName = imagen.originalname.replace(/\.[^/.]+$/, '') + '.webp';
                const fileBuffer = await sharp(imagen.buffer)
                    .webp()
                    .toBuffer();

                const response = await axios.put(
                    `${bunnyStorageAPI}${fileName}`,
                    fileBuffer,
                    {
                        headers: {
                            'Content-Type': 'image/webp',
                            'AccessKey': process.env.bunnyNetAPIKEY
                        }
                    }
                );

                // Actualizar la URL de la imagen en el producto
                producto.imagen = `${process.env.bunnyNetPullZone}/${fileName}`;
                
            } catch (error) {
                console.error('Error al subir la imagen a Bunny Storage:', error.message);
                return res.status(500).json({ error: 'Error al subir la imagen a Bunny Storage' });
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