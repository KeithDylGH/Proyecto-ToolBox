const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const CUsuario = require('../models/usuario'); // Ajusta la ruta según tu estructura

// Configuración del transporte para nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'toolboxproyecto@gmail.com',
        pass: 'degf euub exnz rvfr' // Cambia esto por la contraseña de tu cuenta de correo
    }
});

const confirmarPago = async (req, res) => {
    const { producto, precio, cantidad, metodo } = req.body;
    const usuario = req.session.user;

    if (!usuario) {
        console.error('Usuario no autenticado');
        return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    try {
        const usuarioBD = await CUsuario.findOne({ usuario: usuario.usuario }).exec();

        if (!usuarioBD) {
            console.error('No se encontró el usuario en la base de datos');
            return res.status(400).json({ error: 'Correo electrónico no disponible.' });
        }

        const emailUsuario = usuarioBD.correo;

        if (!emailUsuario || !producto || !precio || !cantidad || !metodo) {
            console.error('Datos faltantes:', {
                correo: emailUsuario,
                producto,
                precio,
                cantidad,
                metodo
            });
            return res.status(400).json({ error: 'Faltan datos necesarios para el correo.' });
        }

        const doc = new PDFDocument();
        const pdfPath = path.join(__dirname, 'factura.pdf');

        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(12).text('Factura de Compra', { align: 'center' });
        doc.text(`Método de Pago: ${metodo}`);
        doc.text(`Producto: ${producto}`);
        doc.text(`Precio: $${precio}`);
        doc.text(`Cantidad: ${cantidad}`);
        doc.text(`Total: $${(precio * cantidad).toFixed(2)}`);
        doc.end();

        await new Promise((resolve, reject) => {
            doc.on('finish', resolve);
            doc.on('error', reject);
        });

        const mailOptions = {
            from: 'toolboxproyecto@gmail.com',
            to: emailUsuario,
            subject: 'Factura de Compra',
            html: `
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <h2 style="text-align: center; color: #007bff;">Factura de Compra</h2>
                        <p>Hola,</p>
                        <p>Gracias por tu compra. Adjunto encontrarás la factura de tu compra.</p>
                        <p><strong>Método de Pago:</strong> ${metodo}</p>
                        <p><strong>Producto:</strong> ${producto}</p>
                        <p><strong>Precio:</strong> $${precio}</p>
                        <p><strong>Cantidad:</strong> ${cantidad}</p>
                        <p><strong>Total:</strong> $${(precio * cantidad).toFixed(2)}</p>
                        <p>Saludos,<br>El equipo de Toolbox</p>
                    </div>
                </body>
                </html>
            `,
            attachments: [{ filename: 'factura.pdf', path: pdfPath }]
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    reject(new Error('Error al enviar el correo.'));
                } else {
                    console.log('Correo enviado:', info.response);
                    fs.unlink(pdfPath, (err) => {
                        if (err) console.error('Error al eliminar el archivo PDF:', err);
                    });
                    resolve({ message: 'Correo enviado correctamente.' });
                }
            });
        });

        res.status(200).json({ message: 'Correo enviado correctamente.' });
    } catch (error) {
        console.error('Error al confirmar el pago:', error);
        res.status(500).json({ error: 'Error al confirmar el pago.' });
    }
};

module.exports = { confirmarPago };