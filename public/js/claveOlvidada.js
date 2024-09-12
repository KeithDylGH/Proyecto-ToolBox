// Para el formulario de restablecimiento de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const correo = document.getElementById('correo').value.trim();

            try {
                const response = await fetch('/claveOlvidada', { // Asegúrate de que la ruta sea correcta
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo })
                });

                const data = await response.json();
                const notification = document.querySelector('.notification');

                if (data.success) {
                    notification.textContent = 'Se ha enviado un enlace para restablecer tu contraseña.';
                    notification.classList.add('alert', 'alert-success');
                } else {
                    notification.textContent = data.error || 'Error al enviar el enlace';
                    notification.classList.add('alert', 'alert-danger');
                }

                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('alert', 'alert-success', 'alert-danger');
                }, 3000);
            } catch (error) {
                console.error('Error:', error);
                const notification = document.querySelector('.notification');
                notification.textContent = 'Error de conexión';
                notification.classList.add('alert', 'alert-danger');

                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('alert', 'alert-danger');
                }, 3000);
            }
        });
    }
});

// Para el formulario de cambio de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nuevaPassword = document.getElementById('nuevaPassword').value.trim();
            const confirmarPassword = document.getElementById('confirmarPassword').value.trim();
            const token = document.querySelector('input[name="token"]').value;

            if (nuevaPassword !== confirmarPassword) {
                const notification = document.querySelector('.notification');
                notification.textContent = 'Las contraseñas no coinciden.';
                notification.classList.add('alert', 'alert-danger');
                
                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('alert', 'alert-danger');
                }, 3000);
                return;
            }

            try {
                const response = await fetch('/nuevaClave', { // Asegúrate de que la ruta sea correcta
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nuevaPassword, token })
                });

                const data = await response.json();
                const notification = document.querySelector('.notification');

                if (data.success) {
                    notification.textContent = 'Contraseña cambiada con éxito.';
                    notification.classList.add('alert', 'alert-success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 3000);
                } else {
                    notification.textContent = data.error || 'Error al cambiar la contraseña';
                    notification.classList.add('alert', 'alert-danger');
                }

                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('alert', 'alert-success', 'alert-danger');
                }, 3000);
            } catch (error) {
                console.error('Error:', error);
                const notification = document.querySelector('.notification');
                notification.textContent = 'Error de conexión';
                notification.classList.add('alert', 'alert-danger');

                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('alert', 'alert-danger');
                }, 3000);
            }
        });
    }
});