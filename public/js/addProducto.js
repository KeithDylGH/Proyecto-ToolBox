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
    const imagen = document.querySelector('#imagen').files[0];

    if (!nombre || !precio || !categoria || !descripcion || !imagen) {
        mostrarAlerta('Todos los campos y la imagen son obligatorios');
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('descripcion', descripcion);
    formData.append('imagen', imagen);

    try {
        const response = await fetch('/api/products/agregar', {
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