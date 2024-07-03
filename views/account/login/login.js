/* const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { buscarUsuarioPorNombre } = require('../../../controllers/buscarUsuario'); // Asegúrate de usar la función correcta


async function iniciarSesion(usuario, contraseña) {
    try {
        const user = await buscarUsuarioPorNombre(usuario); // Usa la función correcta

        if (!user) {
            console.log("No existe el usuario.");
            return { success: false, message: 'Usuario no encontrado' };
        }

        const passwordCorrecta = await bcrypt.compare(contraseña, user.password);
        if (!passwordCorrecta) {
            console.log("Contraseña incorrecta.");
            return { success: false, message: 'Contraseña incorrecta' };
        }

        console.log("Usuario encontrado exitosamente.");
        return { success: true, user };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return { success: false, message: 'Error en el servidor' };
    }
}

router.post('/', async (req, res) => {
    const { usuario, contraseña } = req.body;
    const result = await iniciarSesion(usuario, contraseña);

    if (result.success) {
        res.json({ success: true, user: result.user });
    } else {
        res.status(400).json({ success: false, message: result.message });
    }
});

module.exports = router; */






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
            body: JSON.stringify({ usuario, contraseña: password })
        });

        const data = await response.json();

        const notification = document.querySelector('.notification');

        if (response.ok) {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);

            // Redirigir a la página de cuentas
            window.location.href = '/cuenta/inicio/';
        } else {
            // Mostrar alerta de error en el formulario
            notification.textContent = data.message;
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
        notification.textContent = 'Usuario o clave incorrecta';
        notification.classList.add('alert', 'alert-danger');

        // Desaparecer la notificación después de 3 segundos
        setTimeout(() => {
            notification.textContent = '';
            notification.classList.remove('alert', 'alert-danger');
        }, 3000);
    }
});
