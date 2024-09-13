// Datos del usuario
const form = document.querySelector('form');
const eliminarBtn = document.querySelector('.btn-danger');

// Manejar el envío del formulario para actualizar los datos del usuario
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const usuario = document.getElementById('usuario').value;
    const telefono = document.getElementById('telefono').value;
    const cedula = document.getElementById('cedula').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
        const response = await fetch('/api/usuario/actualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                apellido,
                correo,
                usuario,
                telefono,
                cedula,
                contrasena,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos');
        }

        alert('Datos actualizados correctamente');
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al actualizar los datos');
    }
});

// Manejar la eliminación de la cuenta
eliminarBtn.addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
        try {
            const response = await fetch('/api/usuario/eliminar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la cuenta');
            }

            alert('Cuenta eliminada correctamente');
            window.location.href = '/'; // Redirigir al usuario a la página de inicio o login
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al eliminar la cuenta');
        }
    }
});