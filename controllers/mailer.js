const nodemailer = require('nodemailer');

// Configura tu transporter de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'toolboxproyecto@gmail.com',
        pass: 'tu_contraseña' // Reemplaza con tu contraseña de Gmail o una App Password
    }
});

// Función para enviar correos
const enviarCorreo = async (correo, asunto, mensaje) => {
    try {
        await transporter.sendMail({
            from: 'toolboxproyecto@gmail.com',
            to: correo,
            subject: asunto,
            text: mensaje,
        });
        return { success: 'Correo enviado correctamente' };
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw new Error('Error en el servidor al enviar el correo');
    }
};

module.exports = { enviarCorreo };
