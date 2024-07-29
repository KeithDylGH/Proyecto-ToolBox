require('dotenv').config();
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch instalado
const FormData = require('form-data'); // Asegúrate de instalar form-data

async function subirImagen(file) {
    const form = new FormData();
    form.append('file', file.buffer, file.originalname); // Ajusta según la forma en que envíes el archivo

    const url = `https://storage.bunnycdn.com/${process.env.bunnyNetZONE}/${file.originalname}`;
    const apiKey = process.env.bunnyNetAPIKEY;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            ...form.getHeaders(),
            'AccessKey': apiKey
        },
        body: form
    });

    if (!response.ok) {
        throw new Error(`Error al subir la imagen: ${response.statusText}`);
    }

    return url;
}

module.exports = { subirImagen };