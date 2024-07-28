const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Asegúrate de que el nombre del modelo coincida
const multer = require('multer');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Ruta de destino
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo
    }
  });
  
  const upload = multer({ storage: storage });


// Ruta para agregar productos
router.post('/admin/inventario', upload.single('imagen'), async (req, res) => {
    try {
      const producto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        imagen: req.file.path // Ruta de la imagen cargada
      };
        
        await nuevoProducto.save();
        res.status(200).json({ mensaje: 'Producto agregado con éxito' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ mensaje: 'Error al agregar el producto' });
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
    try {
        const { nombre, precio, categoria, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, {
            nombre,
            precio,
            categoria,
            descripcion,
            imagen
        }, { new: true });

        if (!productoActualizado) return res.status(404).json({ error: 'Producto no encontrado' });

        res.status(200).json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

module.exports = router;