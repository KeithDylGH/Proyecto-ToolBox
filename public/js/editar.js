document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const cancelBtn = document.getElementById('cancelar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const id = form.getAttribute('action').split('/').pop();
        console.log('ID del producto:', id);

        try {
            const response = await fetch(`/api/products/editar/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                console.log('Producto actualizado con éxito');
                window.location.href = '/inventario/verproducto';
            } else {
                const errorText = await response.text();
                console.error('Error al actualizar el producto:', errorText);
            }
        } catch (error) {
            console.error('Error en el frontend:', error);
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/inventario/verproducto';
    });
});