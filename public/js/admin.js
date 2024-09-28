document.addEventListener('DOMContentLoaded', function() {
    const inventarioBtn = document.getElementById('inventarioBtn');
    if (inventarioBtn) {
        inventarioBtn.addEventListener('click', function() {
            window.location.href = '/admin/inventario/';
        });
    }

    const paginaAdmin = document.getElementById('admin');
    if (paginaAdmin) {
        paginaAdmin.addEventListener('click', function() {
            window.location.href = '/admin/';
        });
    }

    //INVENTARIO
    const irALaPaginaDeInv = document.getElementById('invPag');

    if (irALaPaginaDeInv) {
        irALaPaginaDeInv.addEventListener('click', function() {
            window.location.href = '/admin/inventario/';
        });
    }

    const addPro = document.getElementById('addBtn');

    if (addPro){
        addPro.addEventListener('click', function() {
            window.location.href = '/inventario/agregarproduto/'
        })
    }

    const verProducto = document.getElementById('verBtn');

    if (verProducto){
        verProducto.addEventListener('click', function() {
            window.location.href = '/inventario/verproducto/'
        })
    }

    const verCategoria = document.getElementById('btnCat');

    if (verCategoria){
        verCategoria.addEventListener('click', function() {
            window.location.href = '/inventario/categoria/'
        })
    }

    const PDFyExcel = document.getElementById('dBtn');

    if (PDFyExcel){
        PDFyExcel.addEventListener('click', function() {
            window.location.href = '/inventario/descargarInv/'
        })
    }

});

//PERMISOS
// Función para cambiar el rol de un usuario
function changeRole(userId, newRole) {
    fetch(`/api/usuarios/permisos/rol/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: newRole }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success'); // Mostrar notificación de éxito
            location.reload(); // Recargar la página para ver los cambios
        } else {
            showNotification(data.message, 'error'); // Mostrar notificación de error
        }
    })
    .catch(error => {
        console.error('Error al cambiar el rol:', error);
        showNotification('Error al cambiar el rol. Intenta de nuevo.', 'error');
    });
}

// Función para banear a un usuario
function banUser(userId) {
    if (confirm('¿Estás seguro de que quieres banear a este usuario?')) {
        fetch(`/api/usuarios/permisos/banear/${userId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message, 'success'); // Mostrar notificación de éxito
                location.reload(); // Recargar la página para ver los cambios
            } else {
                showNotification(data.message, 'error'); // Mostrar notificación de error
            }
        })
        .catch(error => {
            console.error('Error al banear al usuario:', error);
            showNotification('Error al banear al usuario. Intenta de nuevo.', 'error');
        });
    }
}