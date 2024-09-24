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
                password: formData.get('password'),
                numero: formData.get('numero'),
                cedula: formData.get('cedula')
            };

            try {
                const response = await fetch('/usuarios/actualizar', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    alert('Datos actualizados correctamente');
                    window.location.href = '/cuenta';
                } else {
                    alert(result.error || 'Error al actualizar datos');
                }
            } catch (error) {
                console.error('Error al enviar datos:', error);
                alert('Error en el servidor');
            }
        });
    }
});