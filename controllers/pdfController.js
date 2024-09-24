const { PDFDocument, rgb } = require('pdf-lib'); // Asegúrate de importar rgb
const fs = require('fs');
const path = require('path');

exports.generarPdfCarrito = async (productosArray, metodo) => {
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Cargar el logo
    const logoPath = path.join(__dirname, '../public/img/logo/logo.png');
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.5); // Escalar el logo si es necesario

    // Calcular la posición para centrar el logo
    const logoX = (width - logoDims.width) / 2;
    const logoY = height - logoDims.height - 10; // Espacio de 10px desde la parte superior

    // Dibujar el logo en el PDF
    page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoDims.width,
        height: logoDims.height,
    });

    // Agregar el título
    page.drawText('Factura de Compra', {
        x: 50,
        y: height - 50,
        size: 24,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Método de Pago: ${metodo}`, {
        x: 50,
        y: height - 80,
        size: 12,
        color: rgb(0, 0, 0),
    });

    let yPosition = height - 120;
    for (const producto of productosArray) {
        const nombre = producto.nombre || 'Producto desconocido';
        const precio = producto.precio || 0;
        const cantidad = producto.cantidad || 1;
        
        page.drawText(`${nombre}: $${precio} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`, {
            x: 50,
            y: yPosition,
            size: 12,
            color: rgb(0, 0, 0),
        });
        yPosition -= 20;
    }

    const total = productosArray.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    page.drawText(`Total: $${total.toFixed(2)}`, {
        x: 50,
        y: yPosition - 20,
        size: 12,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(tmpDir, 'factura.pdf');
    fs.writeFileSync(pdfPath, pdfBytes);
    return pdfPath;
};