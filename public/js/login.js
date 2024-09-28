document.addEventListener('DOMContentLoaded', function() {
    const botonCrearCuenta = document.getElementById('create');
    const botonACasa = document.getElementById('homeBtn');
    const claveOlvidada = document.getElementById('olvidada');

    if (botonCrearCuenta) {
        botonCrearCuenta.addEventListener('click', function() {
            window.location.href = '/registrar/';
        });
    }

    if (botonACasa) {
        botonACasa.addEventListener('click', function() {
            window.location.href = '/';
        });
    }

    if (claveOlvidada) {
        claveOlvidada.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/claveOlvidada/';
        });
    }
});

// login.js
const loginForm = document.querySelector('#loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mostrar loader
        document.getElementById('loader').classList.remove('d-none');

        const usuario = document.querySelector('#usuario').value.trim();
        const contraseña = document.querySelector('#password').value.trim();

        const notification = document.querySelector('.notification');

        if (!usuario || !contraseña) {
            if (notification) {
                notification.textContent = 'Por favor, complete todos los campos.';
                notification.classList.add('alert', 'alert-danger');

                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('alert', 'alert-danger');
                }, 3000);
            }
            // Ocultar loader antes de salir
            document.getElementById('loader').classList.add('d-none');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, contraseña })
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación.');
            }

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                // Redirigir a /cuenta para todos los roles
                window.location.href = '/cuenta';
            } else {
                if (notification) {
                    notification.textContent = data.error || 'Error en el inicio de sesión';
                    notification.classList.add('alert', 'alert-danger');

                    setTimeout(() => {
                        notification.textContent = '';
                        notification.classList.remove('alert', 'alert-danger');
                    }, 3000);
                }
                // Ocultar loader si hay error
                document.getElementById('loader').classList.add('d-none');
            }
        } catch (error) {
            console.error('Error:', error);
            if (notification) {
                notification.textContent = 'Contraseña o Usuario incorrecto.';
                notification.classList.add('alert', 'alert-danger');

                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('alert', 'alert-danger');
                }, 3000);
            }
            // Ocultar loader en caso de error
            document.getElementById('loader').classList.add('d-none');
        }
    });
}