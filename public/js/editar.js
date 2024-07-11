// editar.js

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    
    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const formData = new FormData(formulario);
        const productId = formulario.getAttribute('data-id');
        
        try {
            const response = await fetch(`/api/products/admin/inventario/${productId}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            const result = await response.json();

            // Mostrar notificación de éxito
            alert('Producto actualizado con éxito');

            // Redireccionar a la página de inventario
            window.location.href = '/admin/inventario/';
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al actualizar el producto');
        }
    });

    // Event listener para el botón Cancelar
    const cancelarBtn = document.getElementById('cancelar');
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function() {
            // Redireccionar a la página de inventario
            window.location.href = '/admin/inventario/';
        });
    }
});
