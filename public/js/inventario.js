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

document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll('.btn-eliminar');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');

            try {
                const response = await fetch(`/inventario/eliminar/${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Producto eliminado con éxito');
                    location.reload();
                } else {
                    const error = await response.json();
                    alert(`Error al eliminar el producto: ${error.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el producto');
            }
        });
    });
});