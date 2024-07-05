document.addEventListener('DOMContentLoaded', function() {
    const inventarioBtn = document.getElementById('inventarioBtn');

    inventarioBtn.addEventListener('click', function() {
        window.location.href = '/admin/inventario/';
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const paginaAdmin = document.getElementsByClassName('admin');

    paginaAdmin.addEventListener('click', function() {
        window.location.href = '/admin/'
    })
})

//INVENTARIO
document.addEventListener('DOMContentLoaded', function(){
    const verProducto = document.getElementById('verBtn');

    verProducto.addEventListener('click', function() {
        window.location.href = '/admin/'
    })
})
