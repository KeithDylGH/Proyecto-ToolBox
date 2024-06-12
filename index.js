const app = require('./app');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor conectado (escuchando) al puerto ${PORT}`);
});
