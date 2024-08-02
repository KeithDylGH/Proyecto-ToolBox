document.getElementById('formularioCategoria').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita el envío del formulario por defecto

    const nombre = document.getElementById('nombreCategoria').value;
    try {
        const response = await fetch('/api/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre })
        });

        if (response.ok) {
            const nuevaCategoria = await response.json();
            // Actualiza la interfaz o redirige a la página deseada
            alert('Categoría agregada con éxito');
            window.location.href = '/inventario/categoria'; // Redirige a la página de categorías
        } else {
            const error = await response.json();
            alert('Error al agregar categoría: ' + error.error);
        }
    } catch (error) {
        console.error('Error al agregar la categoría:', error);
    }
});