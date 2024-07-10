document.getElementById('formulario').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('desc').value;

    const productoId = '<%= producto._id %>'; // Asegúrate de que esto se interpole correctamente

    console.log(`Enviando datos para producto ID: ${productoId}`);

    try {
        const response = await fetch(`/inventario/editar/${productoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio, categoria, descripcion })
        });

        const data = await response.json(); // Intentamos leer la respuesta como JSON

        if (response.ok) {
            alert('Producto editado con éxito');
            window.location.href = '/inventario/verproducto';
        } else {
            console.error('Error al editar el producto:', data);
            alert('Error al editar el producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al editar el producto');
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

