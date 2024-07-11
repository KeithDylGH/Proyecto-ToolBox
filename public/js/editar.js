// Función para actualizar un producto
const actualizarProducto = async (id, datos) => {
    try {
        // Validación de campos obligatorios
        if (!datos.nombre || !datos.precio || !datos.categoria || !datos.descripcion) {
            mostrarAlerta('Completa todos los campos antes de guardar cambios', 'error');
            return;
        }

        const response = await fetch(`/inventario/editar/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('No se pudo completar la solicitud de actualización');
        }

        const data = await response.json();
        console.log(data.message);

        mostrarAlerta('Cambios realizados correctamente');
        setTimeout(() => {
            window.location.href = '/inventario/verproducto';
        }, 2000); // Redirige a la página Ver Productos después de 2 segundos
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        mostrarAlerta(`Error al actualizar el producto: ${error.message}`, 'error');
    }
};

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

// Evento para manejar el envío del formulario de edición
document.getElementById('formulario').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('desc').value;

    const formulario = document.getElementById('formulario');
    const id = formulario.dataset.id;

    const datosProducto = { nombre, precio, categoria, descripcion };

    // Llamar a la función para actualizar el producto
    await actualizarProducto(id, datosProducto);
});

// Evento para cancelar la edición
document.addEventListener('DOMContentLoaded', function(){
    const cancelarBtn = document.getElementById('cancelar');

    cancelarBtn.addEventListener('click', function() {
        window.location.href = '/inventario/verproducto/'
    })
})