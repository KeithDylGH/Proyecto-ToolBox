// public/js/editUser.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('editUserForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                usuario: formData.get('usuario'),
                correo: formData.get('correo'),
                password: formData.get('password'), // Puede estar vacío si no se quiere cambiar
                numero: formData.get('numero'),
                cedula: formData.get('cedula')
            };

            try {
                const response = await fetch('/cuenta/configuracion/editar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Error al actualizar datos');
                }

                alert('Datos actualizados correctamente');
                window.location.href = '/cuenta'; // Redirige a la página deseada
            } catch (error) {
                console.error('Error al enviar datos:', error);
                alert('Error en el servidor: ' + error.message);
            }
        });
    }
});