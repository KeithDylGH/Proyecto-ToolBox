//Entrar a la pagina Registrar
document.addEventListener('DOMContentLoaded', function() {

    const botonCrearCuenta = document.getElementById('create');

    botonCrearCuenta.addEventListener('click', function() {
        window.location.href = './register/index.html';
    });
});

//Entrar a la pagina Home
document.addEventListener('DOMContentLoaded', function() {

    const botonACasa = document.getElementById('homeBtn');

    botonACasa.addEventListener('click', function() {
        window.location.href = './home/index.html';
    });
});
