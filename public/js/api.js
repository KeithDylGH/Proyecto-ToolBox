const url = 'https://proyecto-toolbox.onrender.com/api/productos';

export const nuevoProducto = async producto => {
    try {
        await fetch(`${url}/agregar`, {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(error);
    }
};

export const obtenerProductos = async () => {
    try{
        const resultado = await fetch(url);
        const productos = await resultado.json();
        return productos;
    }catch(error){
        console.log(error)
    }
};

export const obtenerProducto = async id => {
    try{
        const resultado = await fetch(`${url}/${id}`);
        const producto = await resultado.json();
        return producto;
    }catch(error){
        console.log(error)
    }
};

export async function editarProducto(productId, data) {
    const response = await fetch(`/api/admin/inventario/${productId}`, { // Asegúrate de que la ruta sea correcta
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el producto');
    }

    return await response.json();
}


export const eliminarProducto = async id => {
    try{
        await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });
    }catch(error){
        console.log(error)
    }
};
