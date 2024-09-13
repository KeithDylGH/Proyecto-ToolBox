// Manejar el envío del formulario para la recuperación de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();

            try {
                const response = await fetch('/api/claveOlvidada', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo: email })
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

// Renovar la clave
document.addEventListener('DOMContentLoaded', function() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nuevaPassword = document.getElementById('nuevaPassword').value.trim();
            const confirmarPassword = document.getElementById('confirmarPassword').value.trim();
            const token = document.querySelector('input[name="token"]').value;
            const correo = document.querySelector('input[name="correo"]').value;

            console.log({ nuevaPassword, confirmarPassword, token, correo }); // Verifica los valores

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
                const response = await fetch('/nuevaClave', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nuevaPassword, token, correo })
                });

                // Verifica si la respuesta es JSON
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
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
                } else {
                    throw new Error('Respuesta del servidor no es JSON');
                }
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