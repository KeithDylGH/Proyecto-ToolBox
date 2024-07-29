const express = require('express');
const router = express.Router();
const axios = require('axios');
const Producto = require('../models/producto');
require('dotenv').config();

// Obtén las variables de entorno
const bunnyAccessKey = process.env.bunnyNetAPIKEY;
const bunnyStorageUrl = `https://${process.env.bunnyNetHOSTNAME}/${process.env.bunnyNetZONE}`;
const bunnyPullZoneUrl = `https://${process.env.bunnyNetPullZone}`;

// Configura multer para manejar la carga de archivos
const multer = require('multer');
const upload = multer(); // Configura multer para manejar los archivos

// Ruta para subir archivos
router.post('/upload', upload.single('inputImagen'), async (req, res) => {
    if (!req.file || !req.body.nombre || !req.body.precio || !req.body.categoria || !req.body.descripcion) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    try {
        const file = req.file;
        const fileName = file.originalname;
        const fileBuffer = file.buffer;

        // Sube el archivo a Bunny.net
        const response = await axios.put(
            `${bunnyStorageUrl}/${fileName}`,
            fileBuffer,
            {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'AccessKey': bunnyAccessKey,
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            // URL del archivo subido usando el Pull Zone
            const fileUrl = `${bunnyPullZoneUrl}/${fileName}`;

            // Guardar el producto en MongoDB
            const nuevoProducto = new Producto({
                nombre: req.body.nombre,
                precio: req.body.precio,
                imagen: {
                    data: fileUrl, // Usamos la URL del Pull Zone como el campo data
                    contentType: file.mimetype // Ajusta el tipo de contenido según el archivo subido
                },
                categoria: req.body.categoria,
                descripcion: req.body.descripcion // Incluido el campo descripcion
            });

            await nuevoProducto.save();

            // Redirigir a /inventario/verproducto
            res.redirect('/inventario/verproducto');
        } else {
            const errorMsg = `Error al subir el archivo. Código de estado: ${response.status}`;
            console.error(errorMsg);
            res.status(response.status).send(errorMsg);
        }
    } catch (err) {
        if (err.response) {
            console.error(`Error en la respuesta de Bunny.net: ${err.response.status} - ${err.response.data}`);
            res.status(err.response.status).send(`Error en la respuesta de Bunny.net: ${err.response.status}`);
        } else if (err.request) {
            console.error('Error en la solicitud a Bunny.net:', err.request);
            res.status(500).send('Error en la solicitud a Bunny.net. Verifica la conexión de red.');
        } else {
            console.error('Error inesperado:', err.message);
            res.status(500).send('Error inesperado. Por favor, intenta nuevamente.');
        }
    }
});

module.exports = router;