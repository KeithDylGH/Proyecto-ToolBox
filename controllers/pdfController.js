const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.generarPdf = async ({ productos, metodo }) => {
    try {
        const doc = await PDFDocument.create();
        const page = doc.addPage([600, 800]);
        const yStart = 750;
        let yOffset = yStart;

        page.drawText('Factura de Compra del Carrito', { x: 50, y: yOffset, size: 18 });
        yOffset -= 30;

        page.drawText(`Método de Pago: ${metodo}`, { x: 50, y: yOffset, size: 12 });
        yOffset -= 30;

        productos.forEach(producto => {
            page.drawText(`Producto: ${producto.nombre}`, { x: 50, y: yOffset, size: 12 });
            page.drawText(`Precio Unitario: $${producto.precio.toFixed(2)}`, { x: 50, y: yOffset - 20, size: 12 });
            page.drawText(`Cantidad: ${producto.cantidad}`, { x: 50, y: yOffset - 40, size: 12 });
            page.drawText(`Total: $${(producto.precio * producto.cantidad).toFixed(2)}`, { x: 50, y: yOffset - 60, size: 12 });
            yOffset -= 100;
        });

        page.drawText(`Monto Total: $${productos.reduce((total, p) => total + (p.precio * p.cantidad), 0).toFixed(2)}`, { x: 50, y: yOffset, size: 12 });

        // Crear el directorio 'tmp' si no existe
        const tmpDir = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Guardar el archivo PDF en la carpeta 'tmp'
        const pdfPath = path.join(tmpDir, `factura_carrito_${Date.now()}.pdf`);
        const pdfBytes = await doc.save();
        fs.writeFileSync(pdfPath, pdfBytes);

        return pdfPath;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error;
    }
};