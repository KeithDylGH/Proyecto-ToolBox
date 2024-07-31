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
        // Asegúrate de que la URL de la imagen se pase correctamente
        productos.forEach(producto => {
            if (producto.imagen && typeof producto.imagen === 'object' && producto.imagen.data) {
                // Convertir el campo `data` en una URL completa accesible
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

// Función para subir imagen a Bunny Storage
async function uploadImageToBunnyStorage(fileBuffer, originalname) {
    const filename = path.basename(originalname);
    const url = `${process.env.bunnyNetPullZone}/${filename}`;
    
    try {
        await axios.put(url, fileBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'AccessKey': process.env.bunnyNetAPIKEY
            }
        });
        console.log(`Imagen subida con éxito: ${url}`);
        return url;
    } catch (error) {
        console.error('Error al subir la imagen a Bunny Storage:', error);
        throw error;
    }
}

// Ruta para actualizar producto
router.put('/inventario/editar/:id', upload.single('inputImagen'), async (req, res) => {
    try {
        const productoId = req.params.id;
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file; // Manejo del archivo de imagen

        // Verificar datos recibidos
        console.log('Datos recibidos:', req.body);
        console.log('Archivo recibido:', imagen);

        // Subir imagen y obtener URL
        let imagenURL = null;
        if (imagen) {
            imagenURL = await uploadImageToBunnyStorage(imagen.buffer, imagen.originalname);
        }

        // Actualizar producto
        const productoActualizado = await Producto.findByIdAndUpdate(productoId, {
            nombre,
            precio,
            categoria,
            descripcion,
            imagen: imagenURL ? { data: imagenURL } : undefined
        }, { new: true });

        res.json(productoActualizado);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
});

module.exports = router;