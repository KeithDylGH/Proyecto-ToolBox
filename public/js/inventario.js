const url = 'https://proyecto-toolbox.onrender.com/api/products';

const eliminarProducto = async (id) => {
    try {
        const response = await fetch(`${url}/admin/inventario/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }

        alert('Producto eliminado correctamente');
        location.reload();
    } catch (error) {
        console.error('Error:', error.message);
        alert('Hubo un error al eliminar el producto');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id;
            if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                eliminarProducto(id);
            }
        });
    });
});