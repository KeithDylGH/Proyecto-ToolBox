document.addEventListener('DOMContentLoaded', function() {
    const botonACasa = document.getElementById('homeBtn');

    botonACasa.addEventListener('click', function() {
        window.location.href = '/';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const carritoBtn = document.getElementById('carritoBtn');

    carritoBtn.addEventListener('click', function() {
        window.location.href = '/cuenta/carrito';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const contactoBtn = document.getElementById('contactoBtn');

    contactoBtn.addEventListener('click', function() {
        window.location.href = '/cuenta/contactos';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const configuracionBtn = document.getElementById('configuracionBtn');

    configuracionBtn.addEventListener('click', function() {
        window.location.href = '/cuenta/configuracion';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const logout = document.getElementById('logout');

    logout.addEventListener('click', function() {
        window.location.href = '/login';
    });
});