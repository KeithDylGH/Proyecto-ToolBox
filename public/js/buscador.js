//BUSCADOR
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');

    searchInput.addEventListener('input', async function () {
        const query = searchInput.value.trim();

        if (query.length > 0) {
            try {
                const response = await fetch(`/buscarProductos?nombre=${encodeURIComponent(query)}`);
                const productos = await response.json();

                // Limpiar sugerencias anteriores
                suggestionsContainer.innerHTML = '';

                // Mostrar nuevas sugerencias
                productos.forEach(producto => {
                    const suggestionItem = document.createElement('a');
                    suggestionItem.href = `/tienda/producto/${producto._id}`;
                    suggestionItem.className = 'list-group-item list-group-item-action';
                    suggestionItem.innerHTML = `
                        <img src="${producto.imagen ? producto.imagen.data : '/path/to/default-image.jpg'}" alt="${producto.nombre}" class="img-thumbnail me-2" style="width: 50px;">
                        ${producto.nombre}
                    `;
                    suggestionsContainer.appendChild(suggestionItem);
                });

                // Mostrar el contenedor de sugerencias
                suggestionsContainer.classList.add('show');
            } catch (error) {
                console.error('Error al buscar productos:', error);
            }
        } else {
            // Ocultar sugerencias si la búsqueda está vacía
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.remove('show');
        }
    });

    // Ocultar sugerencias cuando se haga clic fuera del formulario
    document.addEventListener('click', function (event) {
        if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.remove('show');
        }
    });
});