document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const productId = formulario.getAttribute('data-id');

    if (!productId) {
        console.error('No se encontró el ID del producto en el formulario.');
        return;
    }

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(formulario);
        formData.append('id', productId); // Agregar el ID al FormData

        try {
            // Enviar el formulario con datos de imagen
            const response = await fetch(`/api/products/inventario/editar/${productId}`, {
                method: 'PUT',
                body: formData // No es necesario establecer Content-Type en FormData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            const result = await response.json();

            // Mostrar notificación de éxito
            alert('Producto actualizado con éxito');

            // Redireccionar a la página de inventario
            window.location.href = '/inventario/verproducto';
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
            window.location.href = '/inventario/verproducto';
        });
    }
});