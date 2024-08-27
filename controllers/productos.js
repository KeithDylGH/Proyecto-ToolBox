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

const bunnyStorageAPI = `https://storage.bunnycdn.com/${process.env.bunnyNetZONE}/`;
const bunnyAccessKey = process.env.bunnyNetAPIKEY;
const bunnyStorageUrl = `https://${process.env.bunnyNetHOSTNAME}/${process.env.bunnyNetZONE}`;
const bunnyPullZoneUrl = `https://${process.env.bunnyNetPullZone}`;


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
        // Asegúrate de que la URL de la imagen se pase correctamente
        productos.forEach(producto => {
            if (producto.imagen && typeof producto.imagen === 'object' && producto.imagen.data) {
                // Asegúrate de que `producto.imagen.data` contenga la URL completa
                producto.imagen.data = `${process.env.bunnyNetPullZone}/${producto.imagen.data.split('/').pop()}`;
                console.log('URL de la imagen:', producto.imagen.data);
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
        
        // Eliminar la imagen de Bunny Storage
        if (producto.imagen && typeof producto.imagen.data === 'string') {
            const imagenUrl = producto.imagen.data;
            const imagenNombre = imagenUrl.split('/').pop();
            
            const deleteResponse = await fetch(`${bunnyStorageAPI}${imagenNombre}`, {
                method: 'DELETE',
                headers: {
                    'AccessKey': bunnyAccessKey,
                    'Content-Type': 'application/json' // Asegúrate de que el tipo de contenido sea correcto
                },
            });
            
            if (!deleteResponse.ok) {
                throw new Error(`Error al eliminar la imagen de Bunny Storage: ${deleteResponse.statusText}`);
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
    console.log('Solicitud PUT recibida para el producto con ID:', req.params.id);
    console.log('Datos recibidos en la solicitud:', req.body);
    console.log('Archivo recibido:', req.file);

    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file; // Archivo de imagen recibido
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

        // Verificar si se proporciona una nueva imagen
        if (imagen) {
            try {
                // Eliminar la imagen antigua de Bunny Storage si existe
                if (producto.imagen && typeof producto.imagen.data === 'string') {
                    const imagenUrl = producto.imagen.data;
                    const imagenNombre = imagenUrl.split('/').pop();
                    
                    const deleteResponse = await fetch(`${bunnyStorageAPI}${imagenNombre}`, {
                        method: 'DELETE',
                        headers: {
                            'AccessKey': bunnyAccessKey,
                            'Content-Type': 'application/json' // Asegúrate de que el tipo de contenido sea correcto
                        },
                    });
                    
                    if (!deleteResponse.ok) {
                        throw new Error(`Error al eliminar la imagen antigua de Bunny Storage: ${deleteResponse.statusText}`);
                    }
                }

                // Convertir la nueva imagen a formato WebP
                const fileName = imagen.originalname.replace(/\.[^/.]+$/, '') + '.webp';
                const fileBuffer = await sharp(imagen.buffer)
                    .webp()
                    .toBuffer();

                // Subir la nueva imagen a Bunny Storage
                const response = await axios.put(
                    `${bunnyStorageUrl}/${fileName}`,
                    fileBuffer,
                    {
                        headers: {
                            'Content-Type': 'image/webp',
                            'AccessKey': bunnyAccessKey
                        }
                    }
                );

                if (response.status === 200 || response.status === 201) {
                    console.log('Nueva imagen subida a Bunny Storage:', response.data);

                    // Actualizar la URL de la imagen en el producto
                    producto.imagen = {
                        data: `${bunnyPullZoneUrl}/${fileName}`,
                        contentType: 'image/webp'
                    };
                } else {
                    console.error(`Error al subir la nueva imagen a Bunny Storage: ${response.statusText}`);
                    return res.status(500).json({ error: 'Error al subir la nueva imagen a Bunny Storage' });
                }

            } catch (error) {
                console.error('Error al subir la nueva imagen a Bunny Storage:', error.message);
                return res.status(500).json({ error: 'Error al subir la nueva imagen a Bunny Storage' });
            }
        }

        // Guardar los cambios en el producto
        await producto.save();
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error en la actualización del producto:', error.message);
        res.status(500).json({ error: 'Error en la actualización del producto' });
    }
});

module.exports = router;