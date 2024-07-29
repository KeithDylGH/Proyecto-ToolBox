import { mostrarAlerta } from "./alerta.js";
import { subirImagen } from '../../controllers/subirProducto.js'; // Asegúrate de que la ruta sea correcta

const formulario = document.querySelector('#formulario');

formulario.addEventListener('submit', validarProducto);

async function validarProducto(e) {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const precio = document.querySelector('#precio').value;
    const categoria = document.querySelector('#categoria').value;
    const descripcion = document.querySelector('#desc').value;
    const imagen = document.querySelector('#imagen').files[0]; // Selecciona la imagen

    if (!nombre || !precio || !categoria || !descripcion || !imagen) {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', imagen);

        const response = await fetch('/api/subir-imagen', { // Debes definir esta ruta en el backend
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen');
        }

        const { fileName } = await response.json();
        const imagenUrl = `https://storage.bunnycdn.com/${process.env.bunnyNetZONE}/${fileName}`;

        const producto = {
            nombre,
            precio,
            categoria,
            descripcion,
            imagenUrl
        };

        const productoResponse = await fetch('/api/productos/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (!productoResponse.ok) {
            throw new Error('Error al agregar el producto');
        }

        mostrarAlerta('Producto agregado exitosamente');
        setTimeout(() => {
            window.location.href = '/inventario/verproducto/';
        }, 1000);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        mostrarAlerta('Error al agregar el producto. Inténtalo de nuevo.');
    }
}