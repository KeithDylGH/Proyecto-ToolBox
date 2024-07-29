require('dotenv').config();
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch instalado
const FormData = require('form-data'); // Asegúrate de instalar form-data

export async function subirImagen(imagen) {
    const formData = new FormData();
    formData.append('file', imagen);

    const response = await fetch('/api/subir-imagen', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    return data.url; // Asegúrate de que el backend devuelva la URL de la imagen
}

module.exports = { subirImagen };