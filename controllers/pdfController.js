exports.generarPdfCarrito = async (productos, metodo) => {
    try {
        const doc = await PDFDocument.create();
        const page = doc.addPage([600, 400]);
        let contenido = `Factura de Compra\nMétodo: ${metodo}\n\nProductos:\n`;

        productos.forEach(item => {
            contenido += `Producto: ${item.nombre}, Precio: $${item.precio}, Cantidad: ${item.cantidad}, Total: $${(item.precio * item.cantidad).toFixed(2)}\n`;
        });

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