require('dotenv').config();
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch instalado
const FormData = require('form-data'); // Asegúrate de instalar form-data

export async function subirImagen(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/subir-imagen', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    return data.url; // Asegúrate de que `data.url` contiene la URL de la imagen subida
}

module.exports = { subirImagen };