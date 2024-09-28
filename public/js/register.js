document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('#formulario');
    const loader = document.querySelector('.loader'); // Asegúrate de tener un elemento con clase .loader para el loader

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

        // Mostrar el loader
        loader.style.display = 'block';

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
        loader.style.display = 'none';

        if (!response.ok) {
            // Muestra el cuerpo de la respuesta en caso de error
            const errorText = await response.text();
            console.error('Error en la respuesta:', errorText);
            showNotification('Error: ' + errorText, 'error');
            return;
        }

        const result = await response.json();

        if (response.ok) {
            showNotification(result.mensaje, 'success');
            setTimeout(() => {
                window.location.href = '/login/'; // Redirige al inicio de sesión
            }, 3000); // Espera 3 segundos antes de redirigir
        } else {
            showNotification(result.error, 'error');
        }
        console.log('La respuesta del servidor: ', response);
    });
});