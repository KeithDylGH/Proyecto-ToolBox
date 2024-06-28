//Entrar a la pagina Registrar
document.addEventListener('DOMContentLoaded', function() {

    const botonCrearCuenta = document.getElementById('create');

    botonCrearCuenta.addEventListener('click', function() {
        window.location.href = '/registrar/';
    });
});

//Entrar a la pagina Home
document.addEventListener('DOMContentLoaded', function() {

    const botonACasa = document.getElementById('homeBtn');

    botonACasa.addEventListener('click', function() {
        window.location.href = '/';
    });
});

const loginBtn = document.querySelector('#loginBtn');

loginBtn.addEventListener('submit', async e=>{
    e.preventDefault();

    console.log('CLick')
})









//formulario Login
//SELECTORES

/* const formL = document.querySelector('#loginForm');
const inputLogin = document.querySelector('#usuario');
const notificacion = document.querySelector('.notification');
//const inputClave = document.querySelector('#password');

formL.addEventListener('submit', async e=>{
    e.preventDefault();

    const respuesta = await fetch('http://localhost:3000/usuarios',{
        method: 'GET'
    });

    const administrador = await respuesta.json();

    const admin = administrador.find(i=>i.usuario === inputLogin.value);

    if(!admin){
        notificacion.innerHTML = 'El usuario no existe';
        notificacion.classList.add('show-notification');
        setTimeout(()=>{
            notificacion.classList.remove('show-notification');
        },3000);
    }else{
        //si existe, debe tomar el valor y guardarlo en el localstorage
        localStorage.setItem('user', JSON.stringify(admin))
        window.location.href = '../admin/index.html';
    }
}) */
