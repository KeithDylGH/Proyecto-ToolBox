document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('#formulario');
    const loader = document.querySelector('#loader');
    const notification = document.querySelector('#notification');

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

        // Validar si las contraseñas coinciden
        if (password !== confirmPassword) {
            showNotification('Las contraseñas no coinciden', 'error');
            return; // Detiene la ejecución si las contraseñas no coinciden
        }

        // Mostrar el loader
        loader.classList.remove('d-none');

        try {
            const response = await fetch('/api/usuarios/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    usuario: username,
                    correo: email,
                    password: password,
                    numero: phoneNumber,
                    cedula: cedula
                }),
            });

            // Ocultar el loader
            loader.classList.add('d-none');

            if (!response.ok) {
                const errorText = await response.text(); // Obtener el texto del error
                console.error('Error en la respuesta:', errorText);
                showNotification('Error: ' + errorText, 'error');
                return;
            }

            const result = await response.json();

            // Mostrar mensaje de éxito o error basado en la respuesta
            if (result.success) { // Cambia 'success' por la clave correcta de tu respuesta
                showNotification(result.mensaje, 'success');
                setTimeout(() => {
                    window.location.href = '/login/'; // Redirige al inicio de sesión
                }, 3000); // Espera 3 segundos antes de redirigir
            } else {
                showNotification(result.error || 'Error desconocido', 'error');
            }

        } catch (error) {
            // Manejo de errores de la solicitud
            console.error('Error al enviar la solicitud:', error);
            showNotification('Error al enviar la solicitud', 'error');
            loader.classList.add('d-none'); // Oculta el loader en caso de error
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