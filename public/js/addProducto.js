import { mostrarAlerta } from "./alerta.js";

//* SELECTORES
const formulario = document.querySelector('#formulario');

//* EVENTOS
formulario.addEventListener('submit', validarProducto);

//* FUNCIONES
async function validarProducto(e) {
    e.preventDefault();

    const formData = new FormData(formulario);

    // Validar campos
    if (validacion(Object.fromEntries(formData.entries()))) {
        mostrarAlerta('Todos los campos son obligatorios.');
        return;
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
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

function validacion(obj) {
    return !Object.values(obj).every(i => i !== '');
}