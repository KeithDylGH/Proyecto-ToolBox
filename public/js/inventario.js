const url = 'https://proyecto-toolbox.onrender.com/api/products'; // Asegúrate de que la URL sea correcta

const axios = require('axios');

// Función para eliminar un producto
async function eliminarProducto(id) {
    try {
        const response = await axios.delete(`${url}/${id}`);
        console.log('Producto eliminado con éxito', response.data);
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
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