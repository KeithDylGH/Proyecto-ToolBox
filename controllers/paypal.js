const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const axios = require('axios'); // Importar axios

// Configuración de PayPal
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Endpoint para crear una transacción de PayPal
router.post('/create-payment', async (req, res) => {
    const { productos } = req.body;

    // Calcular el total a pagar
    let total = 0;
    for (const item of productos) {
        const producto = await Producto.findById(item.id);
        const cantidad = parseInt(item.cantidad) || 1;
        total += producto.precio * cantidad;
    }

    const paymentData = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: total.toFixed(2),
            },
            description: 'Compra de productos',
        }],
    };

    try {
        // Llamada a la API de PayPal para crear el pago
        const { data } = await axios.post('https://api.sandbox.paypal.com/v2/checkout/orders', paymentData, {
            auth: {
                username: PAYPAL_CLIENT_ID,
                password: PAYPAL_SECRET
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Devolver el ID de la orden
        res.json({ orderID: data.id });
    } catch (error) {
        console.error('Error al crear el pago:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al crear el pago' });
    }
});

// Endpoint para manejar la respuesta de PayPal después del pago
router.post('/capture-payment', async (req, res) => {
    const { orderID } = req.body; // Obtener el ID de la orden del cuerpo de la solicitud

    // Validar la entrada
    if (!orderID) {
        return res.status(400).json({ error: 'El ID de la orden es obligatorio.' });
    }

    try {
        // Capturar el pago
        const { data: detallesPago } = await axios.post(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
            auth: {
                username: PAYPAL_CLIENT_ID,
                password: PAYPAL_SECRET
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Log para ver la respuesta completa
        console.log('Pago capturado:', detallesPago);

        // Aquí puedes realizar acciones adicionales como guardar el pedido en la base de datos

        // Devolver la respuesta
        res.status(200).json({
            message: 'Pago completado con éxito',
            id: detallesPago.id
        });
    } catch (error) {
        console.error('Error al capturar el pago:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al capturar el pago' });
    }
});

// Endpoint para manejar cancelaciones
router.get('/cancel', (req, res) => {
    res.send('El pago ha sido cancelado.');
});

module.exports = router;