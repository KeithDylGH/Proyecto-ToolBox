//Entrar a la pagina Log-in
document.addEventListener('DOMContentLoaded', function() {

    const botonIniciarSesion = document.getElementById('login');

    botonIniciarSesion.addEventListener('click', function() {
        window.location.href = '/login/';
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const botonIniciarSesion = document.getElementById('categoria');

    botonIniciarSesion.addEventListener('click', function() {
        window.location.href = '../../shop/Catalogo/index.html';
    });
});
