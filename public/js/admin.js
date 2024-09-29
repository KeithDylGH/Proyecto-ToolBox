document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", function(event) {
        // Mostrar el loader principal
        document.querySelector('.loader-overlay').style.display = 'flex';

        // Mostrar el mini-loader
        showMiniLoader();
    });
});

// Funciones para manejar el mini loader
function showMiniLoader() {
    document.getElementById('mini-loader').style.display = 'block'; // Mostrar mini loader
}

function hideMiniLoader() {
    document.getElementById('mini-loader').style.display = 'none'; // Ocultar mini loader
}

// PERMISOS
// Función para cambiar el rol de un usuario
function changeRole(userId, newRole) {
    showMiniLoader(); // Mostrar el mini loader al inicio

    fetch(`/api/usuarios/permisos/rol/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: newRole }),
    })
    .then(response => response.json())
    .then(data => {
        hideMiniLoader(); // Ocultar el mini loader después de la respuesta
        if (data.success) {
            showNotification(data.message, 'success'); // Mostrar notificación de éxito
            location.reload(); // Recargar la página para ver los cambios
        } else {
            showNotification(data.message, 'error'); // Mostrar notificación de error
        }
    })
    .catch(error => {
        hideMiniLoader(); // Ocultar el mini loader en caso de error
        console.error('Error al cambiar el rol:', error);
        showNotification('Error al cambiar el rol. Intenta de nuevo.', 'error');
    });
}

// Función para banear a un usuario
function banUser(userId) {
    if (confirm('¿Estás seguro de que quieres banear a este usuario?')) {
        showMiniLoader(); // Mostrar el mini loader al inicio

        fetch(`/api/usuarios/permisos/banear/${userId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            hideMiniLoader(); // Ocultar el mini loader después de la respuesta
            if (data.success) {
                showNotification(data.message, 'success'); // Mostrar notificación de éxito
                location.reload(); // Recargar la página para ver los cambios
            } else {
                showNotification(data.message, 'error'); // Mostrar notificación de error
            }
        })
        .catch(error => {
            hideMiniLoader(); // Ocultar el mini loader en caso de error
            console.error('Error al banear al usuario:', error);
            showNotification('Error al banear al usuario. Intenta de nuevo.', 'error');
        });
    }
}