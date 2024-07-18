document.addEventListener('DOMContentLoaded', function() {
    const userElement = document.getElementById('username');
    if (userElement) {
        userElement.innerText = userElement.textContent; // Se asegura de que el contenido se actualice si es necesario
    }
});