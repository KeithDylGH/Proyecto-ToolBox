// Función para actualizar un producto
const actualizarProducto = async (id, datos) => {
    try {
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

        mostrarAlerta('Producto actualizado correctamente');
        setTimeout(() => {
            window.location.href = '/inventario/verproducto';
        }, 2000);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        mostrarAlerta(`Error al actualizar el producto: ${error.message}`, 'error');
    }
};

// Función para eliminar un producto
const eliminarProducto = async (id) => {
    try {
        const confirmacion = confirm('¿Estás seguro de que quieres eliminar este producto?');

        if (!confirmacion) {
            return;
        }

        const response = await fetch(`/inventario/eliminar/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }

        const data = await response.json();
        console.log(data.message);

        mostrarAlerta('Producto eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        mostrarAlerta('Error al eliminar el producto', 'error');
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

    console.log({ nombre, precio, categoria, descripcion });

    const formulario = document.getElementById('formulario');
    const id = formulario.dataset.id;

    const datosProducto = { nombre, precio, categoria, descripcion };

    // Llamar a la función para actualizar el producto
    await actualizarProducto(id, datosProducto);
});

// Evento para manejar la eliminación del producto
const botonesEliminar = document.querySelectorAll('.btn-eliminar');

botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', async () => {
        const idProducto = boton.dataset.id;
        await eliminarProducto(idProducto);
    });
});
