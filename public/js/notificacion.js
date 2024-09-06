// notificacion.js

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`; // Cambiar clase según el tipo de notificación
    notification.style.display = 'block'; // Asegurarse de que la notificación sea visible
    setTimeout(() => {
        notification.style.display = 'none'; // Ocultar notificación después de 3 segundos
    }, 3000);
}

// Mostrar notificación de éxito o error basado en parámetros de la URL
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('success');
    const errorMessage = urlParams.get('error');

    if (successMessage) {
        showNotification(successMessage, 'success');
        history.replaceState({}, document.title, window.location.pathname); // Limpiar parámetros de la URL
    } else if (errorMessage) {
        showNotification(errorMessage, 'error');
        history.replaceState({}, document.title, window.location.pathname); // Limpiar parámetros de la URL
    }
});