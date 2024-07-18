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


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.redirect('/');
    });
});