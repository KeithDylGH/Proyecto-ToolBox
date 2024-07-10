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

async function eliminarProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            const response = await fetch(`/inventario/eliminar/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Producto eliminado con éxito');
                location.reload();
            } else {
                alert('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}