require('dotenv').config();
const fetch = require('node-fetch'); // Asegúrate de instalar node-fetch si no lo has hecho

async function subirImagen(file) {
    const url = `https://${process.env.bunnyNetHOSTNAME}/${process.env.bunnyNetZONE}/${file.name}`;
    const apiKey = process.env.bunnyNetAPIKEY;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
            'AccessKey': apiKey
        },
        body: file
    });

    if (!response.ok) {
        throw new Error('Error al subir la imagen');
    }

    return url;
}

module.exports = { subirImagen };