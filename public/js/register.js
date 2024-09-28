document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('#formulario');
    const loader = document.querySelector('#loader');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('name').value;
        const apellido = document.getElementById('lName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const cedula = document.getElementById('cedula').value;

        if (password !== confirmPassword) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        loader.classList.remove('d-none');

        try {
            const response = await fetch('/api/usuarios/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    usuario: username,
                    correo: email,
                    password,
                    numero: phoneNumber,
                    cedula
                }),
            });
        
            loader.classList.add('d-none');
        
            if (!response.ok) {
                const result = await response.json(); //
                showNotification(result.error || 'Error desconocido', 'error');
                return;
            }
        
            const result = await response.json();
        
            if (result.mensaje) {
                showNotification(result.mensaje, 'success');
                setTimeout(() => {
                    window.location.href = '/login/';
                }, 3000);
            } else {
                showNotification('Error desconocido', 'error');
            }
        
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            showNotification('Error al enviar la solicitud', 'error');
            loader.classList.add('d-none');
        }        
    });
});

// Función para mostrar la notificación
function showNotification(message, type) {
    const notification = document.querySelector('#notification');
    notification.textContent = message;
    notification.className = `notification ${type}`; // Asigna la clase de tipo (success o error)
    notification.classList.remove('d-none'); // Muestra la notificación

    // Oculta la notificación después de 3 segundos
    setTimeout(() => {
        notification.classList.add('d-none');
    }, 3000);
}