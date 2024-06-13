const Login = document.querySelector('#LogIn');


Login.addEventListener("DOMContentLoaded", function() {
    // Verifica si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      // Redirige a la página de inicio de sesión si no está autenticado
      window.location.href = "/views/account/login/index.html";
    }
  });