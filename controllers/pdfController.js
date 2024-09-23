const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const tmpDir = 'tmp'; // Asegúrate de que esta carpeta exista

exports.generarPdfCarrito = async (productos, metodo) => {
    try {
        const doc = await PDFDocument.create();
        const page = doc.addPage([600, 400]);
        
        // Estilo y texto inicial
        let contenido = `Factura de Compra\nMétodo: ${metodo}\n\nProductos:\n`;
        let totalGeneral = 0;

        productos.forEach(item => {
            const totalItem = item.precio * item.cantidad;
            contenido += `Producto: ${item.nombre}, Precio: $${item.precio}, Cantidad: ${item.cantidad}, Total: $${totalItem.toFixed(2)}\n`;
            totalGeneral += totalItem;
        });

        contenido += `\nTotal General: $${totalGeneral.toFixed(2)}`; // Mostrar total general
        
        // Dibuja el texto en la página
        page.drawText(contenido, {
            x: 50,
            y: 350,
            size: 12
        });

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