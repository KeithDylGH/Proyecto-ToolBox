document.getElementById('formEditarUsuario').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    const userId = '<%= usuario.id %>';

    try {
        const response = await fetch(`/api/usuarios/editar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            alert('Datos actualizados correctamente');
        } else {
            alert('Error al actualizar los datos: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al realizar la petición');
    }
});
