document.getElementById('formulario').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = '<%= producto._id %>'; // Asegúrate de que producto._id contenga el ID válido del producto
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('desc').value;

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
            window.location.href = '/inventario/verproducto';
        } else {
            alert('Error al editar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


async function eliminarProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            const response = await fetch(`/inventario/eliminar/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Producto eliminado con éxito');
                window.location.href = '/inventario/verproducto';
            } else {
                alert('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}