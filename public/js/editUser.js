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
                const response = await fetch(window.location.origin + '/cuenta/configuracion/editar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
        
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Error al actualizar datos');
                }
        
                const result = await response.json();
                if (result.success) {
                    alert(result.message);
                    window.location.href = '/cuenta/configuracion/Ver-usuario'; // Redirigir manualmente
                } else {
                    alert('Error al actualizar los datos');
                }
            } catch (error) {
                console.error('Error al enviar datos:', error);
                alert('Error en el servidor: ' + error.message);
            }
        });                
    }
});

// Función para banear a un usuario
function banUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        if (confirm('¿Estás absolutamente seguro?')) { // Segunda confirmación
            fetch(`/api/usuarios/permisos/banear/${userId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload(); // Recargar la página para ver los cambios
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error al eliminar al usuario:', error);
            });
        } else {
            alert('Eliminación cancelada.'); // Mensaje de cancelación
        }
    }
}
// Aquí puedes agregar un evento para llamar a la función banUser cuando sea necesario
document.querySelectorAll('.banUserBtn').forEach(button => {
    button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id'); // Asegúrate de que el ID del usuario esté en el botón
        banUser(userId);
    });
});