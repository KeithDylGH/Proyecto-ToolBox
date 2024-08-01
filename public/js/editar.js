document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const cancelBtn = document.getElementById('cancelar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const id = form.getAttribute('action').split('/').pop();

        try {
            // Actualiza la ruta en el fetch para que coincida con tu backend
            const response = await fetch(`/inventario/editar/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                console.log('Producto actualizado con éxito');
                window.location.href = '/inventario/verproducto';
            } else {
                console.error('Error al actualizar el producto', await response.text());
            }
        } catch (error) {
            console.error('Error en el frontend:', error);
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/inventario/verproducto';
    });
});