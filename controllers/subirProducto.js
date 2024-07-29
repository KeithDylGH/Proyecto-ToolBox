require('dotenv').config();
const fetch = require('node-fetch'); // Asegúrate de instalar node-fetch si no lo has hecho
const fs = require('fs');
const path = require('path');

async function subirImagen(filePath) {
    // Leer el archivo como Buffer
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const url = `https://storage.bunnycdn.com/${process.env.bunnyNetZONE}/${fileName}`;
    const apiKey = process.env.bunnyNetAPIKEY;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream', // Ajusta el Content-Type según sea necesario
            'AccessKey': apiKey
        },
        body: fileBuffer
    });

    if (!response.ok) {
        throw new Error(`Error al subir la imagen: ${response.statusText}`);
    }

    return url;
}

module.exports = { subirImagen };