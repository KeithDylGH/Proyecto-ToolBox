document.addEventListener('DOMContentLoaded', function() {
    const homeBtn = document.getElementById('homeBtn');

    homeBtn.addEventListener('click', function() {
        window.location.href = '/';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const pagBtn = document.getElementById('pagBtn');

    pagBtn.addEventListener('click', function() {
        window.location.href = '/';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const carritoBtn = document.getElementById('carritoBtn');

    carritoBtn.addEventListener('click', function() {
        window.location.href = '/cuenta/carrito/';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const contactoBtn = document.getElementById('contactoBtn');

    contactoBtn.addEventListener('click', function() {
        window.location.href = '/cuenta/atencion/';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const configuracionBtn = document.getElementById('configuracionBtn');

    configuracionBtn.addEventListener('click', function() {
        window.location.href = '/cuenta/configuracion/';
    });
});

document.getElementById('logout').addEventListener('click', function(event) {
    event.preventDefault(); // prevenir el comportamiento predeterminado del enlace
    fetch('/logout', {
        method: 'POST'
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url; // redirigir a la página de inicio de sesión
        }
    }).catch(error => {
        console.error('Error al cerrar sesión:', error);
    });
});