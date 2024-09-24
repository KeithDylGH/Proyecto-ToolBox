const fs = require('fs');
const path = require('path');

exports.generarPdfCarrito = async (productosArray, metodo) => {
    // Asegúrate de que el directorio tmp exista
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Establecer el título
    page.drawText('Factura de Compra', {
        x: 50,
        y: height - 50,
        size: 24,
        color: rgb(0, 0, 0),
    });

    // Establecer el método de pago
    page.drawText(`Método de Pago: ${metodo}`, {
        x: 50,
        y: height - 80,
        size: 12,
        color: rgb(0, 0, 0),
    });

    // Listar productos
    let yPosition = height - 120;
    for (const producto of productosArray) {
        page.drawText(`${producto.nombre}: $${producto.precio} x ${producto.cantidad} = $${(producto.precio * producto.cantidad).toFixed(2)}`, {
            x: 50,
            y: yPosition,
            size: 12,
            color: rgb(0, 0, 0),
        });
        yPosition -= 20;
    }

    // Total
    const total = productosArray.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    page.drawText(`Total: $${total.toFixed(2)}`, {
        x: 50,
        y: yPosition - 20,
        size: 12,
        color: rgb(0, 0, 0),
    });

    // Guardar el PDF
    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(tmpDir, 'factura.pdf'); // Guardar en tmp

    fs.writeFileSync(pdfPath, pdfBytes);
    return pdfPath;
};