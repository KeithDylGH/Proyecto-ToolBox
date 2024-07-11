import { eliminarProducto, editarProducto } from './api';

// Función para editar un producto por su ID
export async function editarProductoEnLista(id) {
    const nombre = prompt('Ingrese el nuevo nombre del producto:');
    const precio = prompt('Ingrese el nuevo precio del producto:');
    const categoria = prompt('Ingrese la nueva categoría del producto:');
    const descripcion = prompt('Ingrese la nueva descripción del producto:');

    if (nombre && precio && categoria && descripcion) {
        try {
            await editarProducto({ id, nombre, precio, categoria, descripcion });
            alert('Producto editado con éxito');
            location.reload(); // Recargar la página para reflejar los cambios
        } catch (error) {
            console.error('Error al editar el producto:', error);
            alert('Error al editar el producto');
        }
    }
}

// Función para manejar el evento de click en los botones de eliminar
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.btn-eliminar');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');

            try {
                await eliminarProducto(productId);
                alert('Producto eliminado con éxito');
                location.reload(); // Recargar la página para reflejar los cambios
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                alert('Error al eliminar el producto');
            }
        });
    });
});
