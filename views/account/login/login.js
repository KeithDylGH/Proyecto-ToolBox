// Entrar a la página Registrar
document.addEventListener('DOMContentLoaded', function() {
    const botonCrearCuenta = document.getElementById('create');

    botonCrearCuenta.addEventListener('click', function() {
        window.location.href = '/registrar/';
    });
});

// Entrar a la página Home
document.addEventListener('DOMContentLoaded', function() {
    const botonACasa = document.getElementById('homeBtn');

    botonACasa.addEventListener('click', function() {
        window.location.href = '/';
    });
});

// Form login
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.querySelector('#usuario').value.trim();
    const contraseña = document.querySelector('#password').value.trim();

    if (!usuario || !contraseña) {
        const notification = document.querySelector('.notification');
        notification.textContent = 'Por favor, complete todos los campos.';
        notification.classList.add('alert', 'alert-danger');

        setTimeout(() => {
            notification.textContent = '';
            notification.classList.remove('alert', 'alert-danger');
        }, 3000);

        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contraseña }) // Asegúrate de que estos nombres coincidan
        });

        const data = await response.json();

        const notification = document.querySelector('.notification');

        if (response.ok) {
            if (data.user.rol === 'admin') {
                window.location.href = '/admin/';
            } else {
                window.location.href = '/cliente/';
            }
        } else {
            notification.textContent = data.error || 'Error en el inicio de sesión';
            notification.classList.add('alert', 'alert-danger');

            setTimeout(() => {
                notification.textContent = '';
                notification.classList.remove('alert', 'alert-danger');
            }, 3000);
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