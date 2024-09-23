const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.generarPdf = async (datos) => {
    const { productos, metodo } = datos;

    try {
        const doc = await PDFDocument.create();
        const page = doc.addPage([600, 800]); // Aumentar el tamaño si hay varios productos
        let y = 750; // Coordenada Y inicial para los productos
        page.drawText(`Factura de Compra`, { x: 50, y, size: 14 });
        y -= 20;

        productos.forEach((producto, index) => {
            const { nombre, precio, cantidad } = producto;
            page.drawText(`Producto ${index + 1}: ${nombre}`, { x: 50, y, size: 12 });
            page.drawText(`Precio: $${precio}`, { x: 50, y: y - 15, size: 12 });
            page.drawText(`Cantidad: ${cantidad}`, { x: 50, y: y - 30, size: 12 });
            y -= 50; // Ajustar el espacio para cada producto
        });

        page.drawText(`Método de Pago: ${metodo}`, { x: 50, y: y - 20, size: 12 });

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