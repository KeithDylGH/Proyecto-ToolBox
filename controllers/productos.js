const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Asegúrate de que el nombre del modelo coincida
const multer = require('multer');
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
router.put('/inventario/editar/:id', upload.single('imagen'), async (req, res) => {
    const productId = req.params.id;

    if (!productId) {
        return res.status(400).json({ error: 'ID del producto no proporcionado' });
    }

    try {
        const updateData = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion
        };

        // Si se proporciona una imagen, debes manejar su almacenamiento
        if (req.file) {
            // Aquí puedes agregar el manejo para subir la imagen
            // Ejemplo: subir la imagen a Bunny Storage y obtener la URL

            // Actualizar la URL de la imagen en el producto
            updateData.imagen = {
                data: 'url_de_la_imagen',
                contentType: req.file.mimetype
            };
        }

        const productoActualizado = await Producto.findByIdAndUpdate(productId, updateData, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado con éxito', producto: productoActualizado });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

module.exports = router;