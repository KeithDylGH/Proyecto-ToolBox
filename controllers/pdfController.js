const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

exports.generarPdf = async ({ producto, precio, cantidad, metodo }) => {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();

        page.drawText('Confirmación de Compra', { x: 50, y: height - 50, size: 24, color: rgb(0, 0, 0) });
        page.drawText(`Producto: ${producto}`, { x: 50, y: height - 100, size: 18, color: rgb(0, 0, 0) });
        page.drawText(`Precio: $${precio}`, { x: 50, y: height - 130, size: 18, color: rgb(0, 0, 0) });
        page.drawText(`Cantidad: ${cantidad}`, { x: 50, y: height - 160, size: 18, color: rgb(0, 0, 0) });
        page.drawText(`Método de Pago: ${metodo}`, { x: 50, y: height - 190, size: 18, color: rgb(0, 0, 0) });

        const pdfBytes = await pdfDoc.save();
        const pdfPath = path.join(__dirname, 'tmp', `factura_${Date.now()}.pdf`);
        fs.writeFileSync(pdfPath, pdfBytes);

        return pdfPath;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error;
    }
};