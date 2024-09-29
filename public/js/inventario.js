const url = 'https://proyecto-toolbox.onrender.com/api/products';

// Función para mostrar el loader normal
const mostrarLoader = () => {
    document.getElementById('loader').style.display = 'flex';
};

// Función para mostrar el mini loader
const mostrarMiniLoader = () => {
    document.getElementById('mini-loader').style.display = 'flex';
};

// Función para ocultar el loader
const ocultarLoader = () => {
    document.getElementById('loader').style.display = 'none';
};

// Función para eliminar un producto
const eliminarProducto = async (id) => {
    try {
        mostrarLoader(); // Mostrar el loader normal

        const response = await fetch(`${url}/eliminar/${id}`, {
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
    } finally {
        ocultarLoader(); // Ocultar el loader al final
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

    // Event listener para la página de edición
    const botonesEditar = document.querySelectorAll('.btn-editar');
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            mostrarMiniLoader(); // Mostrar el mini loader
        });
    });
});