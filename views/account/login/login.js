//Entrar a la pagina Registrar
document.addEventListener('DOMContentLoaded', function() {

    const botonCrearCuenta = document.getElementById('create');

    botonCrearCuenta.addEventListener('click', function() {
        window.location.href = '../register/index.html';
    });
});

//Entrar a la pagina Home
document.addEventListener('DOMContentLoaded', function() {

    const botonACasa = document.getElementById('homeBtn');

    botonACasa.addEventListener('click', function() {
        window.location.href = '../home/index.html';
    });
});


//formulario Login

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;

        axios.post('http://localhost:4000/api/usuarios/login', { usuario, password })
            .then(response => {
                const { token } = response.data;
                // Almacenar el token en localStorage o sessionStorage para su uso posterior
                localStorage.setItem('token', token);
                // Redirigir a la página principal o realizar otra acción
                window.location.href = './index.html'; // Cambiar a la página que desees después del login
            })
            .catch(error => {
                console.error('Error de inicio de sesión:', error.response.data.error);
                // Mostrar mensaje de error al usuario, por ejemplo:
                alert('Error de inicio de sesión. Verifica tus credenciales.');
            });
    });
});
