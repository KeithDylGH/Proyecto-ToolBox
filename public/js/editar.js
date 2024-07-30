document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(formulario);

        console.log('Datos del formulario:', [...formData.entries()]); // Mostrar datos del formulario

        try {
            const response = await fetch(formulario.action, {
                method: 'PUT',
                body: formData
            });

            console.log('Respuesta del servidor:', response); // Ver respuesta completa del servidor

            if (!response.ok) {
                const errorText = await response.text(); // Obtener el texto de error
                console.error('Error en la respuesta del servidor:', errorText); // Mostrar error completo
                throw new Error(`Error al actualizar el producto: ${errorText}`);
            }

            const result = await response.json();

            console.log('Resultado de la actualización:', result); // Mostrar el resultado de la actualización

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