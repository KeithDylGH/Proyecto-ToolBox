const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

exports.generarPdfCarrito = async (productosArray, cantidadesContadas, metodo) => {
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    const logoPath = path.join(__dirname, '../public/img/logo/LogoLetra.png');
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.4);

    const logoX = (width - logoDims.width) / 2;
    const logoY = height - logoDims.height - 20;

    page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoDims.width,
        height: logoDims.height,
    });

    const titleYPosition = logoY - 30;
    page.drawText('Factura de Compra', {
        x: 50,
        y: titleYPosition,
        size: 24,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Método de Pago: ${metodo}`, {
        x: 50,
        y: titleYPosition - 30,
        size: 12,
        color: rgb(0, 0, 0),
    });

    let yPosition = titleYPosition - 60;
    let total = 0;
    for (let id in cantidadesContadas) {
        const producto = productosArray.find(p => p._id.toString() === id);
        const cantidad = cantidadesContadas[id];
        const nombre = producto.nombre || 'Producto desconocido';
        const precio = producto.precio || 0;

        // Dibujar en el PDF
        page.drawText(`${nombre}: $${precio.toFixed(2)} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`, {
            x: 50,
            y: yPosition,
            size: 12,
            color: rgb(0, 0, 0),
        });

        total += precio * cantidad; // Acumula el total
        yPosition -= 20;
    }

    page.drawText(`Total: $${total.toFixed(2)}`, {
        x: 50,
        y: yPosition - 20,
        size: 14,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(tmpDir, `factura-${Date.now()}.pdf`);
    fs.writeFileSync(pdfPath, pdfBytes);
    return pdfPath;
};