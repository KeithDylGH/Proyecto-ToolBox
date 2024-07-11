import { eliminarProducto, editarProducto } from '/controllers/api';

const manejarEliminarProducto = async (id) => {
    try {
        await eliminarProducto(id);
        // Opcional: Realizar alguna acción adicional después de eliminar el producto
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
};

const manejarEditarProducto = async (id) => {
    try {
        await editarProducto(id);
        // Opcional: Realizar alguna acción adicional después de editar el producto
    } catch (error) {
        console.error('Error al editar el producto:', error);
    }
};

// Exportar las funciones para usarlas en otros archivos
export { manejarEliminarProducto, manejarEditarProducto };
