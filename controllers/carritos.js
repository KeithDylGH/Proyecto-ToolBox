const express = require('express');
const Producto = require('../models/producto');
const authorize = require('../middleware/authorize');
const CUsuario = require('../models/usuario'); // Asegúrate de que esta sea la ruta correcta para el modelo Usuario

const carritoRouter = express.Router();

// Agregar al carrito
carritoRouter.post('/add', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        console.log('Buscando usuario:', user.usuario); // Log del usuario
        const usuario = await CUsuario.findOne({ usuario: user.usuario });
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        console.log('Buscando producto por ID:', productoId); // Log del producto
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        // Actualizar la cantidad del producto en el carrito
        const index = usuario.carrito.findIndex(p => p.producto.toString() === productoId);
        if (index !== -1) {
            usuario.carrito[index].cantidad += 1;
            console.log(`Actualizando cantidad del producto en el carrito: ${usuario.carrito[index].cantidad}`); // Log de la cantidad
        } else {
            usuario.carrito.push({ producto: productoId, cantidad: 1 });
            console.log('Producto añadido al carrito:', producto); // Log de nuevo producto añadido
        }

        await usuario.save();
        console.log('Carrito actualizado en la base de datos'); // Log del carrito guardado

        res.json({
            success: true,
            producto: {
                _id: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                categoria: producto.categoria,
                imagen: producto.imagen,
                cantidad: usuario.carrito[index]?.cantidad || 1
            }
        });
    } catch (error) {
        console.error('Error al agregar al carrito:', error); // Log de error
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Obtener productos del carrito
carritoRouter.get('/getCarrito', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        console.log('Buscando usuario y cargando carrito para:', user.usuario); // Log del usuario autenticado
        const usuario = await CUsuario.findOne({ usuario: user.usuario })
            .populate({
                path: 'carrito.producto',
                populate: {
                    path: 'categoria', // Asume que 'categoria' es una referencia a otro modelo
                    select: 'nombre'  // Selecciona solo el nombre de la categoría
                }
            });

        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Mapear el carrito y asegurarse de que producto no es null
        const carrito = usuario.carrito.map(item => {
            if (!item.producto) {
                console.error('Producto no encontrado para el carrito:', item); // Log de error de producto
                return null; // Retornar null si el producto no está disponible
            }

            return {
                _id: item.producto._id,
                nombre: item.producto.nombre,
                precio: item.producto.precio,
                categoria: item.producto.categoria ? item.producto.categoria.nombre : 'Categoría no disponible',
                imagen: item.producto.imagen,
                cantidad: item.cantidad
            };
        }).filter(item => item !== null); // Filtrar los elementos nulos

        console.log('Productos del carrito devueltos:', carrito); // Log de los productos en el carrito
        res.json({ success: true, carrito });
    } catch (error) {
        console.error('Error al obtener el carrito:', error); // Log de error
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Eliminar una unidad del producto en el carrito
carritoRouter.delete('/remove/:productoId', authorize(['user', 'admin', 'boss']), async (req, res) => {
    try {
        const { productoId } = req.params;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        console.log('Eliminando una unidad del producto en el carrito. Producto ID:', productoId); // Log del producto a eliminar
        const usuario = await CUsuario.findOne({ usuario: user.usuario });
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Buscar el producto en el carrito
        const index = usuario.carrito.findIndex(p => p.producto.toString() === productoId);
        if (index !== -1) {
            if (usuario.carrito[index].cantidad > 1) {
                // Disminuir la cantidad del producto
                usuario.carrito[index].cantidad -= 1;
                console.log(`Cantidad actualizada: ${usuario.carrito[index].cantidad}`);
            } else {
                // Eliminar el producto si la cantidad es 1
                usuario.carrito.splice(index, 1);
                console.log('Producto eliminado del carrito');
            }
        } else {
            return res.status(404).json({ success: false, message: 'Producto no encontrado en el carrito' });
        }

        await usuario.save();
        res.json({ success: true, message: 'Producto actualizado en el carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error); // Log de error
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Vaciar el carrito
carritoRouter.delete('/vaciar', authorize(['user', 'admin', 'boss']), async (req, res) => {
    const vaciarCarrito = async (user) => {
        try {
            console.log('Vaciando el carrito para:', user.usuario);
            const usuario = await CUsuario.findOne({ usuario: user.usuario });

            if (!usuario) {
                console.error('Usuario no encontrado');
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            // Verificar si el carrito ya está vacío antes de intentar vaciar
            if (usuario.carrito.length === 0) {
                console.warn('El carrito ya está vacío para el usuario:', user.usuario);
                return res.status(400).json({ success: false, message: 'El carrito ya está vacío' });
            }

            // Vaciar el carrito
            usuario.carrito = [];
            await usuario.save();
            console.log('Carrito vaciado correctamente');
            return res.json({ success: true, message: 'Carrito vaciado exitosamente' });
        } catch (error) {
            if (error.name === 'VersionError') {
                // Verificar de nuevo si el carrito ya está vacío antes de reintentar
                const usuario = await CUsuario.findOne({ usuario: user.usuario });
                if (usuario.carrito.length === 0) {
                    console.warn('El carrito ya está vacío para el usuario (tras el error de versión). No se reintenta.');
                    return res.status(400).json({ success: false, message: 'El carrito ya está vacío' });
                }
                
                console.warn('Error de versión. Intentando nuevamente para:', user.usuario);
                return vaciarCarrito(user); // Reintentar la operación
            }
            console.error('Error al vaciar el carrito:', error);
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
    };

    try {
        const user = req.session.user;

        if (!user) {
            console.error('No hay usuario en la sesión');
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        // Intentar vaciar el carrito
        await vaciarCarrito(user);

    } catch (error) {
        console.error('Error en el proceso de vaciar el carrito:', error);
        return res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = carritoRouter;