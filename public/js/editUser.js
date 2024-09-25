// public/js/editUser.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('editUserForm');

    if (form) {
        // Enviar los datos del formulario al servidor
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar el envío normal del formulario

            const formData = new FormData(form);
            const data = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                usuario: formData.get('usuario'),
                correo: formData.get('correo'),
                password: formData.get('password'), // Este puede ser vacío si no se quiere cambiar
                numero: formData.get('numero'),
                cedula: formData.get('cedula')
            };

            try {
                const response = await fetch('/cuenta/configuracion/editar', { // Cambiado a la ruta correcta
                    method: 'POST', // Asegúrate de que este método coincida con tu lógica en el servidor
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Error en la red'); // Manejo de errores de red
                }

                const result = await response.json();
                if (result.success) {
                    alert('Datos actualizados correctamente');
                    window.location.href = '/cuenta'; // Redirige a la página deseada
                } else {
                    alert(result.error || 'Error al actualizar datos');
                }
            } catch (error) {
                console.error('Error al enviar datos:', error);
                alert('Error en el servidor: ' + error.message); // Mensaje de error más informativo
            }
        });
    }
});