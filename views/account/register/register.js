//Entrar a la pagina Home
document.addEventListener('DOMContentLoaded', function() {

    const botonACasa = document.getElementById('homeBtn');

    botonACasa.addEventListener('click', function() {
        window.location.href = '../home/index.html';
    });
});

//Entrar a la pagina Log-in
document.addEventListener('DOMContentLoaded', function() {

    const botonIniciarSesion = document.getElementById('login');

    botonIniciarSesion.addEventListener('click', function() {
        window.location.href = '../login/index.html';
    });
});