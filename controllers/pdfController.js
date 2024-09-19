const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.generarPdf = async (datos) => {
    const { producto, precio, cantidad, metodo } = datos;

    try {
        const doc = await PDFDocument.create();
        const page = doc.addPage([600, 400]);
        page.drawText(`Factura de Compra\nProducto: ${producto}\nPrecio: $${precio}\nCantidad: ${cantidad}\nMétodo: ${metodo}`, {
            x: 50,
            y: 350,
            size: 12
        });

        // Crear el directorio 'tmp' si no existe
        const tmpDir = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Guardar el archivo PDF en la carpeta 'tmp'
        const pdfPath = path.join(tmpDir, `factura_${Date.now()}.pdf`);
        const pdfBytes = await doc.save();
        fs.writeFileSync(pdfPath, pdfBytes);

        return pdfPath;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error;
    }
};