const express = require('express');
const router = express.Router();
const { buscarUsuarioPorNombre } = require('./buscarUsuario'); // Asegúrate de usar la función correcta

async function iniciarSesion(usuario, contraseña) {
    try {
        const user = await buscarUsuarioPorNombre(usuario); // Usa la función correcta

        if (!user) {
            console.log("No existe el usuario.");
            return null;
        }

        if (user.contraseña !== contraseña) {
            console.log("Contraseña incorrecta.");
            return null;
        }

        console.log("Usuario encontrado exitosamente.");
        return user;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return null;
    }
}

router.post('/', async (req, res) => {
    const { usuario, contraseña } = req.body;
    const user = await iniciarSesion(usuario, contraseña);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
});

module.exports = router;


//Entrar a la pagina Registrar
document.addEventListener('DOMContentLoaded', function() {

    const botonCrearCuenta = document.getElementById('create');

    botonCrearCuenta.addEventListener('click', function() {
        window.location.href = '/registrar/';
    });
});


//Entrar a la pagina Home
document.addEventListener('DOMContentLoaded', function() {

    const botonACasa = document.getElementById('homeBtn');

    botonACasa.addEventListener('click', function() {
        window.location.href = '/';
    });
});

const loginBtn = document.querySelector('#loginBtn');

loginBtn.addEventListener('submit', async e=>{
    e.preventDefault();

    console.log('CLick')
})


//form login
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

        if (response.ok) {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);

            // Redirigir a la página de cuentas
            window.location.href = '/cuenta';
        } else {
            // Mostrar alerta de error en el formulario
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el servidor');
    }
});








//formulario Login
//SELECTORES

/* const formL = document.querySelector('#loginForm');
const inputLogin = document.querySelector('#usuario');
const notificacion = document.querySelector('.notification');
//const inputClave = document.querySelector('#password');

formL.addEventListener('submit', async e=>{
    e.preventDefault();

    const respuesta = await fetch('http://localhost:3000/usuarios',{
        method: 'GET'
    });

    const administrador = await respuesta.json();

    const admin = administrador.find(i=>i.usuario === inputLogin.value);

    if(!admin){
        notificacion.innerHTML = 'El usuario no existe';
        notificacion.classList.add('show-notification');
        setTimeout(()=>{
            notificacion.classList.remove('show-notification');
        },3000);
    }else{
        //si existe, debe tomar el valor y guardarlo en el localstorage
        localStorage.setItem('user', JSON.stringify(admin))
        window.location.href = '../admin/index.html';
    }
}) */
