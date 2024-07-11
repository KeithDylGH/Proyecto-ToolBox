import { eliminarProducto, editarProducto } from '/controllers/api';

document.addEventListener('DOMContentLoaded', () => {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            const productoId = event.target.id.replace('btn-eliminar-', '');

            if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
                try {
                    await eliminarProducto(productoId);
                    alert('Producto eliminado con éxito');
                    location.reload(); // Recarga la página para reflejar los cambios
                } catch (error) {
                    alert('Hubo un error al eliminar el producto');
                    console.error('Error:', error);
                }
            }
        });
    });
});

const manejarEditarProducto = async (id) => {
    try {
        await editarProducto(id);
        // Opcional: Realizar alguna acción adicional después de editar el producto
    } catch (error) {
        console.error('Error al editar el producto:', error);
    }
};

// Exportar las funciones para usarlas en otros archivos
export { manejarEliminarProducto, manejarEditarProducto };
