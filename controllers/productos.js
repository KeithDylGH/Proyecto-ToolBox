const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Asegúrate de que el nombre del modelo coincida
const multer = require('multer');
const axios = require('axios');
const upload = multer({ storage: multer.memoryStorage() });

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

// Ruta para ver productos (esto parece ser un intento previo, asegúrate de cómo deseas manejarla)
router.get('/verproducto', async (req, res) => {
    try {
        const productos = await Producto.find(); // Utiliza el modelo Producto para obtener productos
        res.render('account/cuenta/admin/seeP/index', { productos }); // Ajusta según tu lógica de renderizado
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
router.put('/admin/inventario/editar/:id', upload.single('inputImagen'), async (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const productoId = req.params.id;

        // Verificar si el producto existe
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Actualizar los datos del producto
        producto.nombre = nombre;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.descripcion = descripcion;

        // Subir la imagen a Bunny Storage si se ha proporcionado
        if (req.file) {
            const imageName = `${productoId}_${req.file.originalname}`;
            const uploadResponse = await axios.post(`https://storage.bunnycdn.com/${process.env.bunnyNetZONE}/${imageName}`, req.file.buffer, {
                headers: {
                    'AccessKey': process.env.bunnyNetAPIKEY,
                    'Content-Type': req.file.mimetype
                }
            });

            if (uploadResponse.status === 200) {
                // Actualizar la URL de la imagen en el producto
                producto.imagen = `https://${process.env.bunnyNetPullZone}/${imageName}`;
            } else {
                throw new Error('Error al subir la imagen a Bunny Storage');
            }
        }

        await producto.save();
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

module.exports = router;