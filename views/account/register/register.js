document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const response = await fetch('/api/users/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: username,
            usuario: username,
            correo: email,
            password,
            numero: phoneNumber,
        }),
    });

    const result = await response.json();

    if (response.ok) {
        alert(result.mensaje);
        window.location.href = '/views/account/login/index.html'; // Redirige al inicio de sesión
    } else {
        alert(result.error);
    }
});




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