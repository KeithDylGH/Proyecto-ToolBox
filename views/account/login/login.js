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

const loginBtn = document.querySelector('#loginBtn');

loginBtn.addEventListener('submit', async e => {
    e.preventDefault();

    console.log('Click');
});

// Form login
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.querySelector('#usuario').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        const notification = document.querySelector('.notification');

        if (response.ok) {
            // Guardar el token en localStorage si es necesario
            localStorage.setItem('token', data.token);

            // Redirigir según el rol del usuario
            if (data.user.rol === 'admin') {
                window.location.href = '/admin/';
            } else {
                window.location.href = '/cliente/';
            }
        } else {
            // Mostrar alerta de error en el formulario
            notification.textContent = data.error;
            notification.classList.add('alert', 'alert-danger');

            // Desaparecer la notificación después de 3 segundos
            setTimeout(() => {
                notification.textContent = '';
                notification.classList.remove('alert', 'alert-danger');
            }, 3000);
        }
    } catch (error) {
        console.error('Error:', error);
        const notification = document.querySelector('.notification');
        notification.textContent = 'Error en la conexión con el servidor';
        notification.classList.add('alert', 'alert-danger');

        // Desaparecer la notificación después de 3 segundos
        setTimeout(() => {
            notification.textContent = '';
            notification.classList.remove('alert', 'alert-danger');
        }, 3000);
    }
});