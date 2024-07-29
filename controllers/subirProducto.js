require('dotenv').config();
const fetch = require('node-fetch');

async function subirImagen(buffer, fileName) {
    const url = `https://storage.bunnycdn.com/${process.env.bunnyNetZONE}/${fileName}`;
    const apiKey = process.env.bunnyNetAPIKEY;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream', // Ajusta el Content-Type según sea necesario
            'AccessKey': apiKey
        },
        body: buffer
    });

    if (!response.ok) {
        throw new Error(`Error al subir la imagen: ${response.statusText}`);
    }

    return url;
}

module.exports = { subirImagen };