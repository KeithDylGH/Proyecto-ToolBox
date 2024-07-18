document.addEventListener('DOMContentLoaded', function() {
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = '/';
        });
    }

    const pagBtn = document.getElementById('pagBtn');
    if (pagBtn) {
        pagBtn.addEventListener('click', function() {
            window.location.href = '/';
        });
    }

    const carritoBtn = document.getElementById('carritoBtn');
    if (carritoBtn) {
        carritoBtn.addEventListener('click', function() {
            window.location.href = '/cuenta/carrito/';
        });
    }

    const contactoBtn = document.getElementById('contactoBtn');
    if (contactoBtn) {
        contactoBtn.addEventListener('click', function() {
            window.location.href = '/cuenta/atencion/';
        });
    }

    const configuracionBtn = document.getElementById('configuracionBtn');
    if (configuracionBtn) {
        configuracionBtn.addEventListener('click', function() {
            window.location.href = '/cuenta/configuracion/';
        });
    }

    const btnDatos = document.getElementById('btnDatos');
    if (btnDatos) {
        btnDatos.addEventListener('click', function() {
            window.location.href = '/cuenta/configuracion/cambiar-datos';
        });
    }
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