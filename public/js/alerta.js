export function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {
        const alertContainer = document.createElement('div');
        alertContainer.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'text-center');
        
        const alert = document.createElement('p');
        alert.innerHTML = `
            <strong>Consola:</strong>
            <span>${mensaje}</span>
        `;
        
        alertContainer.appendChild(alert);
        document.body.appendChild(alertContainer); // Agregar el contenedor al body o a algún otro elemento específico
        
        setTimeout(() => {
            alertContainer.remove();
        }, 2500);
    }
}
