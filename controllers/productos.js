const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const multer = require('multer');
const axios = require('axios');

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
                const hostname = process.env.bunnyNetHOSTNAME;
                const storageZone = process.env.bunnyNetZONE;
                const apiKey = process.env.bunnyNetAPIKEY;
                const pullZone = process.env.bunnyNetPullZone;

                if (!hostname || !storageZone || !apiKey || !pullZone) {
                    throw new Error('Configuración de Bunny Storage incompleta');
                }

                // Eliminar la imagen anterior del Bunny Storage
                if (producto && producto.imagen && producto.imagen.data) {
                    const imagenUrl = producto.imagen.data.split('/').pop();
                    try {
                        await axios.delete(`https://${hostname}/${storageZone}/${imagenUrl}`, {
                            headers: { 'AccessKey': apiKey }
                        });
                        console.log('Imagen anterior eliminada de Bunny Storage');
                    } catch (error) {
                        console.error('Error al eliminar la imagen anterior de Bunny Storage:', error.message);
                    }
                }

                // Subir la nueva imagen a Bunny Storage
                const response = await axios.put(
                    `https://${hostname}/${storageZone}/${imagen.originalname}`,
                    imagen.buffer,
                    {
                        headers: {
                            'Content-Type': imagen.mimetype,
                            'AccessKey': apiKey
                        }
                    }
                );
                console.log('Nueva imagen subida a Bunny Storage:', response.data);

                // Actualizar los datos de la imagen en el producto
                producto.imagen = {
                    data: `${pullZone}/${imagen.originalname}`, // URL de la nueva imagen
                    contentType: imagen.mimetype, // Tipo de contenido
                };
            } catch (error) {
                console.error('Error al manejar la imagen en Bunny Storage:', error.message);
                return res.status(500).json({ error: 'Error al manejar la imagen en Bunny Storage' });
            }
        }

        await producto.save();
        console.log('Producto actualizado con éxito');
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

module.exports = router;