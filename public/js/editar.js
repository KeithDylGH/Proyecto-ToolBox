document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(formulario);

        try {
            const response = await fetch(formulario.action, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text(); // Obtener el texto de error
                throw new Error(`Error al actualizar el producto: ${errorText}`);
            }

            const result = await response.json();

            alert('Producto actualizado con éxito');
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