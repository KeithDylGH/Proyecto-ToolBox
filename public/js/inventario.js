document.addEventListener('DOMContentLoaded', () => {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const productoId = e.target.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                try {
                    const response = await fetch(`/api/products/admin/inventario/${productoId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Producto eliminado exitosamente');
                        location.reload(); // Recargar la página después de eliminar
                    } else {
                        throw new Error('Error al eliminar el producto');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un error al intentar eliminar el producto');
                }
            }
        });
    });
});
