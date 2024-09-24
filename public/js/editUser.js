document.addEventListener('DOMContentLoaded', () => {
    const formEditarUsuario = document.getElementById('formEditarUsuario');

    formEditarUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const usuario = document.getElementById('usuario').value;
        const correo = document.getElementById('correo').value;
        const numero = document.getElementById('numero').value;
        const cedula = document.getElementById('cedula').value;

        try {
            const response = await fetch(`/api/usuarios/editar/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, apellido, usuario, correo, numero, cedula }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Datos actualizados correctamente.');
                window.location.reload(); // Recargar la página para reflejar los cambios
            } else {
                alert(result.message || 'Error al actualizar los datos.');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error en el servidor. Inténtalo de nuevo más tarde.');
        }
    });
});