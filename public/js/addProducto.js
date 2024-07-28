import { nuevoProducto } from "./api.js";
import { mostrarAlerta } from "./alerta.js";

//* SELECTORES
const formulario = document.querySelector('#formulario');

//* EVENTOS
formulario.addEventListener('submit', validarProducto);

//* FUNCIONES
async function validarProducto(e) {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const precio = document.querySelector('#precio').value;
    const categoria = document.querySelector('#categoria').value;
    const descripcion = document.querySelector('#desc').value;

    const producto = {
        nombre,
        precio,
        categoria,
        descripcion
    };

    if (validacion(producto)) {
        mostrarAlerta('Todos los campos son obligatorios');
    } else {
        try {
            const response = await fetch('/api/productos/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                throw new Error(`Error al agregar el producto: ${response.statusText}`);
            }

            mostrarAlerta('Producto agregado exitosamente');
            setTimeout(() => {
                window.location.href = '/inventario/verproducto/';
            }, 1000); // Redirige después de mostrar la alerta durante 1 segundo
        } catch (error) {
            console.error('Error al agregar producto:', error);
            mostrarAlerta('Error al agregar el producto. Inténtalo de nuevo.');
        }
    }
}

function validacion(obj) {
    return !Object.values(obj).every(i => i !== '');
}
