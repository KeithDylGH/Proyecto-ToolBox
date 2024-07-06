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
    const verProductos = document.getElementById('verBtn');

    verProductos.addEventListener('click', function() {
        window.location.href = '/inventario/VerProduto/'
    })
})