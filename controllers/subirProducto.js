const express = require('express');
const router = express.Router();
const axios = require('axios');
const Producto = require('../models/producto');
require('dotenv').config();

const bunnyAccessKey = process.env.bunnyNetAPIKEY;
const bunnyStorageUrl = `https://${process.env.bunnyNetHOSTNAME}/${process.env.bunnyNetZONE}`;
const bunnyPullZoneUrl = `https://${process.env.bunnyNetPullZone}`;

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // Límite de 10MB

router.post('/agregar', upload.single('imagen'), async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);
    console.log('Archivo recibido:', req.file);

    if (!req.file || !req.body.nombre || !req.body.precio || !req.body.categoria || !req.body.descripcion) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    try {
        const { originalname: fileName, mimetype, buffer: fileBuffer } = req.file;

        const response = await axios.put(
            `${bunnyStorageUrl}/${fileName}`,
            fileBuffer,
            {
                headers: {
                    'Content-Type': mimetype,
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
                    contentType: mimetype
                },
                categoria: req.body.categoria,
                descripcion: req.body.descripcion
            });

            await nuevoProducto.save();

            res.redirect('/inventario/verproducto');
        } else {
            console.error(`Error al subir el archivo. Código de estado: ${response.status}`);
            res.status(response.status).send(`Error al subir el archivo. Código de estado: ${response.status}`);
        }
    } catch (err) {
        console.error('Error inesperado:', err.message);
        res.status(500).send('Error inesperado. Por favor, intenta nuevamente.');
    }
});

module.exports = router;