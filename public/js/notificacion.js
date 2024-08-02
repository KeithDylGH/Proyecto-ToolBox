// CATEGORIAS
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('d-none');
    setTimeout(() => {
        notification.classList.add('d-none');
    }, 3000); // Mostrar durante 3 segundos
}

// Mostrar notificación de éxito al cargar la página
const urlParams = new URLSearchParams(window.location.search);
const successMessage = urlParams.get('success');
if (successMessage) {
    showNotification(successMessage);
    history.replaceState({}, document.title, window.location.pathname); // Limpiar parámetros de la URL
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('success');
    if (successMessage) {
        showNotification(successMessage);
        history.replaceState({}, document.title, window.location.pathname); // Limpiar parámetros de la URL
    }
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('d-none');
    setTimeout(() => {
        notification.classList.add('d-none');
    }, 3000); // Mostrar durante 3 segundos
}