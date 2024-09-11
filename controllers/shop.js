const express = require('express');
const router = express.Router();

// Controlador para obtener el producto por ID
const getProductById = async (id) => {
    // Aquí debes implementar la lógica para obtener el producto por su ID
    return await iProducto.findById(id); // Ajusta según tu implementación
};

// Ruta para la compra de un producto individual
router.get('/compra/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const producto = await getProductById(productoId);
        if (!producto) {
            return res.status(404).render('404');
        }
        res.render('shop/Compra/index', { producto, cantidad: 1, total: producto.precio });
    } catch (error) {
        console.error(error);
        res.status(500).render('500');
    }
});

// Ruta para la compra de productos en el carrito
router.get('/compra-carrito', async (req, res) => {
    try {
        const productos = await getCarritoProductos(req);
        const totalCarrito = productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        res.render('shop/Compra/carrito', { productos, totalCarrito });
    } catch (error) {
        console.error(error);
        res.status(500).render('500');
    }
});

module.exports = router;