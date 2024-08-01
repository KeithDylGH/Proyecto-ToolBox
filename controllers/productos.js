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
        if (producto.imagen) {
            const imagenNombre = producto.imagen.split('/').pop();
            
            const deleteResponse = await axios.delete(`${bunnyStorageAPI}${imagenNombre}`, {
                headers: {
                    'AccessKey': process.env.bunnyNetAPIKEY,
                },
            });
            
            if (!deleteResponse.status === 204) {
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
async function subirImagenBunnyStorage(file) {
    const fileName = file.originalname.replace(/\.[^/.]+$/, '') + '.webp';
    const fileBuffer = await sharp(file.buffer).webp().toBuffer();
    const url = `${bunnyStorageAPI}${fileName}`;
    
    try {
        await axios.put(url, fileBuffer, {
            headers: {
                'Content-Type': 'image/webp',
                'AccessKey': process.env.bunnyNetAPIKEY
            }
        });
        console.log(`Imagen subida con éxito: ${url}`);
        return url;
    } catch (error) {
        console.error('Error al subir la imagen a Bunny Storage:', error.message);
        throw error;
    }
}

// Ruta para actualizar un producto
router.put('/inventario/editar/:id', upload.single('inputImagen'), async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, precio, categoria, descripcion } = req.body;
        let imagenUrl = req.body.imagenUrl;

        if (req.file) {
            const imagenSubida = await subirImagenBunnyStorage(req.file);
            imagenUrl = imagenSubida;
        }

        await Producto.findByIdAndUpdate(id, {
            nombre,
            precio,
            categoria,
            descripcion,
            imagen: imagenUrl
        });

        res.redirect(`/inventario/verproducto/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el producto');
    }
});

module.exports = router;