import { nuevoProducto } from "./api.js";

//import { mostrarAlerta } from "./alerta.js";

//* SELECTORES
const formulario = document.querySelector('#formulario');

//* EVENTOS
formulario.addEventListener('submit', validarProducto);

//* FUNCIONES
async function validarProducto(e){
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const precio = document.querySelector('#precio').value;
    const categoria = document.querySelector('#categoria').value;
    const descripcion = document.querySelector('#desc').value;

    const producto = {
        nombre,
        precio,
        categoria,
        descripcion
    }

    if(validacion(producto)){
        ////console.log('todos los campos son obligatoriso')
        mostrarAlerta('todos los campos son obligatoriso');
        return;
    }else{
        await nuevoProducto(producto);
        window.location.href = '/inventario/verproducto/';
    }


}

function validacion(obj){
    return !Object.values(obj).every(i=> i !== ''); //<---esta es otra manera de iterar un objeto y el every retorna un true o un false, en este caso valida el objeto producto
}

function mostrarAlerta(mensaje) {
    // Implementa tu función de mostrar alerta aquí
    alert(mensaje);
}