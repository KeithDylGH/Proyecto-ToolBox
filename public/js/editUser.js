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