/* const formulario = document.querySelector('#formulario');

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
        alert('Las contraseñas no coinciden');
        return;
    }

    const response = await fetch('/api/users', {
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

    const result = await response.json();

    if (response.ok) {
        alert(result.mensaje);
        window.location.href = '/login/'; // Redirige al inicio de sesión
    } else {
        alert(result.error);
    }
}); */