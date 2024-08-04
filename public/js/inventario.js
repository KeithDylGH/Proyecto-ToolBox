const url = 'https://proyecto-toolbox.onrender.com'; // Asegúrate de que la URL base sea correcta

// Función para eliminar un producto
async function eliminarProducto(id) {
    const deleteUrl = `/admin/inventario/${id}`; // Verifica que esta URL sea la misma que has definido en el servidor

    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Producto eliminado correctamente');
            // Aquí puedes actualizar la interfaz de usuario
        } else {
            console.error('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error en la solicitud de eliminación:', error.message);
    }
}

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