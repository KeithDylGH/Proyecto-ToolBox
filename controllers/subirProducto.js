const express = require('express');
const router = express.Router();
const axios = require('axios');
const Producto = require('../models/producto');
const multer = require('multer');
require('dotenv').config();

const bunnyAccessKey = process.env.bunnyNetAPIKEY;
const bunnyStorageUrl = `https://${process.env.bunnyNetHOSTNAME}/${process.env.bunnyNetZONE}`;
const bunnyPullZoneUrl = `https://${process.env.bunnyNetPullZone}`;

// Configuración de multer para manejar archivos en memoria
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // Límite de 10MB para archivos

router.post('/agregar', upload.single('imagen'), async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);
    console.log('Archivo recibido:', req.file);

    // Verifica si el archivo se encuentra en la solicitud
    if (!req.file || !req.body.nombre || !req.body.precio || !req.body.categoria || !req.body.descripcion) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    try {
        const file = req.file;
        const fileName = file.originalname;
        const fileBuffer = file.buffer;

        const response = await axios.put(
            `${bunnyStorageUrl}/${fileName}`,
            fileBuffer,
            {
                headers: {
                    'Content-Type': file.mimetype,
                    'AccessKey': bunnyAccessKey,
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            const fileUrl = `${bunnyPullZoneUrl}/${fileName}`;

            const nuevoProducto = new Producto({
                nombre: req.body.nombre,
                precio: req.body.precio,
                imagen: {
                    data: fileUrl,
                    contentType: file.mimetype
                },
                categoria: req.body.categoria,
                descripcion: req.body.descripcion
            });

            await nuevoProducto.save();

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