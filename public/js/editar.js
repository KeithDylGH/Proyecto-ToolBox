document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const cancelBtn = document.getElementById('cancelar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const id = form.getAttribute('action').split('/').pop();

        try {
            const response = await fetch(`/api/products/editar/${id}`, {
                method: 'PUT', // Cambiado a PUT
                body: formData
            });

            if (response.ok) {
                window.location.href = '/inventario/verproducto';
            } else {
                console.error('Error al actualizar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/inventario/verproducto';
    });
});