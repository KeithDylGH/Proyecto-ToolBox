const fetch = require("node-fetch");
require("dotenv").config();
const express = require("express");
const router = express.Router();

// Variables de entorno
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// Función para generar el token de acceso
async function generateAccessToken() {
    const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const request = await fetch(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
        }
    );
    const json = await request.json();
    return json.access_token;
}

// Función para manejar la respuesta
async function handleResponse(response) {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

// Ruta para crear una orden de PayPal
router.post('/create-order', async (req, res) => {
    const { cart } = req.body; // Obtener el carrito desde el cuerpo de la solicitud

    // Validar la entrada
    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'El carrito es obligatorio y no puede estar vacío.' });
    }

    const totalValue = cart.reduce((acc, product) => acc + (product.precio * product.quantity), 0).toFixed(2);

    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;

        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalValue, // Valor total basado en el carrito
                    },
                },
            ],
        };

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        const { jsonResponse, httpStatusCode } = await handleResponse(response);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ error: "No se pudo crear la orden." });
    }
});

// Ruta para capturar el pago
router.post('/payment', async (req, res) => {
    console.log('Recibiendo solicitud de pago');
  
    const { orderID } = req.body; // Obtener el ID de la orden del cuerpo de la solicitud

    // Validar la entrada
    if (!orderID) {
        console.log('Faltan datos en la solicitud');
        return res.status(400).json({ error: 'El ID de la orden es obligatorio.' });
    }

    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { jsonResponse, httpStatusCode } = await handleResponse(response);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Error al capturar el pago:", error);
        res.status(500).json({ error: "No se pudo capturar el pago." });
    }
});

// Exportar el router
module.exports = router;