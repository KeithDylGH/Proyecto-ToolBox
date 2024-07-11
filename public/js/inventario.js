import { eliminarProducto } from 'api'; // Asegúrate de que esta ruta sea correcta

document.addEventListener('DOMContentLoaded', () => {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const productoId = e.target.id.replace('btn-eliminar-', '');
            const confirmar = confirm('¿Estás seguro de que deseas eliminar este producto?');

            if (confirmar) {
                try {
                    await eliminarProducto(productoId);
                    alert('Producto eliminado exitosamente.');
                    location.reload(); // Recargar la página para actualizar la lista de productos
                } catch (error) {
                    console.error('Error al eliminar el producto:', error);
                    alert('Hubo un error al eliminar el producto.');
                }
            }
        });
    });
});
