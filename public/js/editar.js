document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(formulario);

        // Log the FormData content
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            // Enviar el formulario con datos de imagen
            const response = await fetch(formulario.action, {
                method: 'PUT', // Usar PUT para actualizar
                body: formData // No es necesario establecer Content-Type en FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al actualizar el producto: ${errorData.error}`);
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