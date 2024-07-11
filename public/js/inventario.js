import { eliminarProducto } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const botonesEliminar = document.querySelector('#deleteBtn');

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const idProducto = e.target.dataset.id;
            const confirmacion = confirm('¿Estás seguro de que deseas eliminar este producto?');

            if (confirmacion) {
                try {
                    await eliminarProducto(idProducto);
                    alert('Producto eliminado exitosamente.');
                    window.location.reload();
                } catch (error) {
                    console.error('Error al eliminar el producto:', error);
                    alert('Hubo un error al eliminar el producto. Intenta de nuevo.');
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
export { manejarEditarProducto };
