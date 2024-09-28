document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const cancelBtn = document.getElementById('cancelar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const id = form.getAttribute('action').split('/').pop();

        // Mostrar el loader
        document.querySelector('.loader-overlay').style.display = 'flex';

        try {
            const response = await fetch(`/api/products/editar/${id}`, {
                method: 'PUT',
                body: formData
            });

            // Ocultar el loader
            document.querySelector('.loader-overlay').style.display = 'none';

            if (response.ok) {
                // Mostrar notificación de éxito
                showNotification('Producto añadido correctamente.', 'success');
                // Redirigir a la página después de un pequeño delay para mostrar la notificación
                setTimeout(() => {
                    window.location.href = '/inventario/verproducto';
                }, 2000);
            } else {
                console.error('Error al actualizar el producto', await response.text());
                showNotification('Error al actualizar el producto.', 'error');
            }
        } catch (error) {
            // Ocultar el loader
            document.querySelector('.loader-overlay').style.display = 'none';
            console.error('Error en el frontend:', error);
            showNotification('Error en el frontend.', 'error');
        }
    });

    cancelBtn.addEventListener('click', () => {
        // Mostrar el loader al cancelar
        document.querySelector('.loader-overlay').style.display = 'flex';
        setTimeout(() => {
            window.location.href = '/inventario/verproducto';
        }, 500); // Puedes ajustar el tiempo de espera si es necesario
    });
});