import { subirImagen } from '../../controllers/subirProducto.js'; // Asegúrate de la ruta correcta
import { mostrarAlerta } from "./alerta.js";

// SELECTORES
const formulario = document.querySelector('#formulario');

// EVENTOS
formulario.addEventListener('submit', validarProducto);

// FUNCIONES
async function validarProducto(e) {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value.trim();
    const precio = document.querySelector('#precio').value.trim();
    const categoria = document.querySelector('#categoria').value.trim();
    const descripcion = document.querySelector('#desc').value.trim();
    const imagen = document.querySelector('#imagen').files[0];

    if (!nombre || !precio || !categoria || !descripcion || !imagen) {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    try {
        const imagenUrl = await subirImagen(imagen);

        const producto = {
            nombre,
            precio,
            categoria,
            descripcion,
            imagenUrl
        };

        const response = await fetch('/api/productos/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto');
        }

        const result = await response.json();
        mostrarAlerta(result.message || 'Producto agregado exitosamente');
        setTimeout(() => {
            window.location.href = '/inventario/verproducto/';
        }, 1000);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        mostrarAlerta('Error al agregar el producto. Inténtalo de nuevo.');
    }
}