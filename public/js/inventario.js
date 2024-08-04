const url = 'https://proyecto-toolbox.onrender.com/admin/inventario'; // URL corregida para coincidir con el backend

// Función para eliminar un producto
async function eliminarProducto(id) {
    try {
        const response = await axios.delete(`${url}/${id}`);
        console.log('Producto eliminado con éxito', response.data);
        mostrarNotificacion('Producto eliminado con éxito', 'success');
        // Refrescar la página después de eliminar el producto
        window.location.reload();
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        mostrarNotificacion('Error al eliminar el producto', 'error');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    const clase = tipo === 'success' ? 'alert-success' : 'alert-danger';
    const notificacion = document.createElement('div');
    notificacion.className = `alert ${clase}`;
    notificacion.innerText = mensaje;
    document.body.appendChild(notificacion);
    setTimeout(() => {
        notificacion.remove();
    }, 3000); // La notificación se eliminará después de 3 segundos
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