document.addEventListener('DOMContentLoaded', function() {
    const inventarioBtn = document.getElementById('inventarioBtn');

    inventarioBtn.addEventListener('click', function() {
        window.location.href = '/admin/inventario/';
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const paginaAdmin = document.getElementById('admin');

    paginaAdmin.addEventListener('click', function() {
        window.location.href = '/admin/'
    })
})

//INVENTARIO
document.addEventListener('DOMContentLoaded', function(){
    const irALaPaginaDeInv = document.getElementById('invPag');

    irALaPaginaDeInv.addEventListener('click', function() {
        window.location.href = '/admin/inventario/'
    })
})
document.addEventListener('DOMContentLoaded', function(){
    const addPro = document.getElementById('addBtn');

    addPro.addEventListener('click', function() {
        window.location.href = '/inventario/agregarproduto/'
    })
})
document.addEventListener('DOMContentLoaded', function(){
    const verProducto = document.getElementById('verBtn');

    verProducto.addEventListener('click', function() {
        window.location.href = '/inventario/verproducto/'
    })
})
