const url = '/api/admin/inventario'; // Usa la ruta correcta del endpoint

// Función para eliminar un producto
const eliminarProducto = async (id) => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }

        alert('Producto eliminado correctamente');
        location.reload(); // Recargar la página después de eliminar
    } catch (error) {
        console.error('Error:', error.message);
        alert('Hubo un error al eliminar el producto');
    }
};

// Event listener para los botones de eliminar
document.addEventListener('DOMContentLoaded', () => {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                eliminarProducto(id);
            }
        });
    });
});