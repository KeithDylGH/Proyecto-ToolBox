document.addEventListener('DOMContentLoaded', function() {
    const inventarioBtn = document.getElementById('inventarioBtn');

    inventarioBtn.addEventListener('click', function() {
        window.location.href = '/admin/inventario/';
    });
});