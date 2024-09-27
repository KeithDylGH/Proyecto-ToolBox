function showNotification(message, type = 'success') {
    const notification = document.querySelector('.notification');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Mostrar notificación al cargar la página basado en parámetros de URL
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