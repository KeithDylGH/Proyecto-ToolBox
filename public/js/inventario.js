const url = 'https://proyecto-toolbox.onrender.com/api/products'; // Asegúrate de que la URL sea correcta

// Función para eliminar un producto
const eliminarProducto = async (id) => {
    try {
        console.log('Eliminando producto con ID:', id);
        const response = await fetch(`${url}/admin/inventario/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta del servidor:', errorText);
            throw new Error(`Error al eliminar el producto: ${response.status} - ${errorText}`);
        }

        alert('Producto eliminado correctamente');
        location.reload();
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
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