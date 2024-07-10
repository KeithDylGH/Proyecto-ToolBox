async function editarProducto(id) {
    const nombre = prompt('Ingrese el nuevo nombre del producto:');
    const precio = prompt('Ingrese el nuevo precio del producto:');
    const categoria = prompt('Ingrese la nueva categoría del producto:');
    const descripcion = prompt('Ingrese la nueva descripción del producto:');

    if (nombre && precio && categoria && descripcion) {
        try {
            const response = await fetch(`/inventario/editar/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, precio, categoria, descripcion })
            });

            if (response.ok) {
                alert('Producto editado con éxito');
                location.reload();
            } else {
                alert('Error al editar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

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
        console.log(data.message); // Muestra el mensaje de éxito en la consola

        // Opcional: Puedes recargar la página para actualizar la lista de productos
        // location.reload();

        // Opcional: Mostrar una alerta o mensaje en la interfaz
        mostrarAlerta('Producto eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        mostrarAlerta('Error al eliminar el producto', 'error');
    }
};

// Función para manejar la eliminación del producto al hacer clic en el botón correspondiente
const botonesEliminar = document.querySelectorAll('.btn-eliminar');

botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', () => {
        const idProducto = boton.dataset.id;
        eliminarProducto(idProducto);
    });
});