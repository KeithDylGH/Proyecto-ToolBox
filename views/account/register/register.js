//const { response } = require("../../../app");

document.addEventListener('DOMContentLoaded', function(){

    const formulario = document.querySelector('#formulario');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const nombre = document.getElementById('name').value;
        const apellido = document.getElementById('lName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const cedula = document.getElementById('cedula').value;
    
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
    
        const response = await fetch('/api/users/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                usuario: username,
                correo: email,
                password: password,
                numero: phoneNumber,
                cedula: cedula
            }),
        });
    
        const result = await response.json();
    
        if (response.ok) {
            alert(result.mensaje);
            window.location.href = '/login/'; // Redirige al inicio de sesión
        } else {
            alert(result.error);
        }
        console.log('La respuesta del servidor: ', response)
    });
})





//Entrar a la pagina Home
document.addEventListener('DOMContentLoaded', function() {

    const homeBtn = document.getElementById('homeBtn');

    homeBtn.addEventListener('click', function() {
        window.location.href = '/';
    });
});

//Entrar a la pagina Log-in
document.addEventListener('DOMContentLoaded', function() {

    const botonIniciarSesion = document.getElementById('login');

    botonIniciarSesion.addEventListener('click', function() {
        window.location.href = '/login/';
    });
});