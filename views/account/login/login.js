document.addEventListener('DOMContentLoaded', function() {
    // Entrar a la página Registrar
    const botonCrearCuenta = document.getElementById('create');
    botonCrearCuenta.addEventListener('click', function() {
        window.location.href = '/registrar/';
    });

    // Entrar a la página Home
    const botonACasa = document.getElementById('homeBtn');
    botonACasa.addEventListener('click', function() {
        window.location.href = '/';
    });

    // Form login
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usuario = document.querySelector('#usuario').value.trim();
            const contraseña = document.querySelector('#password').value.trim();

            if (!usuario || !contraseña) {
                mostrarNotificacion('Por favor, complete todos los campos.', 'danger');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, contraseña })
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = data.redirectUrl; // Redirigir según la URL proporcionada por el servidor
                } else {
                    mostrarNotificacion(data.message || 'Error en el inicio de sesión', 'danger');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion('Error de conexión', 'danger');
            }
        });
    }

    function mostrarNotificacion(mensaje, tipo) {
        const notification = document.querySelector('.notification');
        notification.textContent = mensaje;
        notification.className = `notification alert alert-${tipo}`;

        setTimeout(() => {
            notification.textContent = '';
            notification.className = 'notification';
        }, 3000);
    }
});