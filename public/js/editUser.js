document.getElementById('formEditarUsuario').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const userId = document.getElementById('userId').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const usuario = document.getElementById('usuario').value;
    const correo = document.getElementById('correo').value;
    const numero = document.getElementById('numero').value;
    const cedula = document.getElementById('cedula').value;

    const response = await fetch(`/api/usuarios/editar/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            apellido,
            usuario,
            correo,
            numero,
            cedula
        })
    });

    const result = await response.json();
    if (result.success) {
        alert('Datos actualizados con éxito');
        // Redirigir o actualizar la interfaz según sea necesario
    } else {
        alert(`Error: ${result.message}`);
    }
});