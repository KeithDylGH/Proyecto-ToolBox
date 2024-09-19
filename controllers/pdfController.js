const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generarPDF = (data, callback) => {
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, 'factura.pdf');

    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(12).text('Factura de Compra', { align: 'center' });
    doc.text(`Método de Pago: ${data.metodo}`);
    doc.text(`Producto: ${data.producto}`);
    doc.text(`Precio: $${data.precio}`);
    doc.text(`Cantidad: ${data.cantidad}`);
    doc.text(`Total: $${(data.precio * data.cantidad).toFixed(2)}`);
    doc.end();

    doc.on('finish', () => {
        console.log('PDF creado y listo para enviar.');
        callback(null, pdfPath);
    });

    doc.on('error', (error) => {
        console.error('Error al crear el PDF:', error);
        callback(error);
    });
};

module.exports = { generarPDF };