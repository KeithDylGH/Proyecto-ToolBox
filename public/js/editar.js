import { obtenerProducto, editarProducto } from 'api';

// Función para cargar los detalles de un producto
const cargarProducto = async (id) => {
    try {
        const producto = await obtenerProducto(id);
        // Aquí puedes usar los datos del producto para llenar los campos del formulario de edición
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('descripcion').value = producto.descripcion;
    } catch (error) {
        console.error('Error al cargar producto:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
};

// Función para enviar los cambios del producto editado
const guardarCambios = async (id, datosProducto) => {
    try {
        await editarProducto({ ...datosProducto, id });
        // Aquí puedes manejar la confirmación de que los cambios se guardaron correctamente
        mostrarAlerta('Cambios guardados correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar cambios:', error);
        mostrarAlerta(`Error al guardar cambios: ${error.message}`, 'error');
    }
};

// Evento para manejar el envío del formulario de edición
document.getElementById('formulario').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value;

    const formulario = document.getElementById('formulario');
    const id = formulario.dataset.id; // Asumiendo que tienes el ID del producto en un atributo data-*

    const datosProducto = { nombre, precio, categoria, descripcion };

    // Llamar a la función para guardar los cambios del producto
    await guardarCambios(id, datosProducto);
});

// Función para mostrar alertas en la interfaz
const mostrarAlerta = (mensaje, tipo = 'success') => {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show mt-3`;
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 5000); // Remover la alerta después de 5 segundos
};

// Llama a cargarProducto al cargar la página, pasando el ID adecuado
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const id = formulario.dataset.id; // Asumiendo que tienes el ID del producto en un atributo data-*
    cargarProducto(id);
});