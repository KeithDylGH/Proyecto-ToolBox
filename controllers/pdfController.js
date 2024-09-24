const { PDFDocument, rgb } = require('pdf-lib');
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
    const logoPath = path.join(__dirname, '../public/img/logo/LogoLetra.png');
    
    // Verificar si el logo existe
    if (!fs.existsSync(logoPath)) {
        throw new Error(`Logo no encontrado en la ruta: ${logoPath}`);
    }
    
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.4); // Escalar el logo a 0.4 para hacerlo más pequeño

    // Calcular la posición para centrar el logo
    const logoX = (width - logoDims.width) / 2;
    const logoY = height - logoDims.height - 20; // Espacio de 20px desde la parte superior

    // Dibujar el logo en el PDF
    page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoDims.width,
        height: logoDims.height,
    });

    // Agregar el título con un espacio adicional
    const titleYPosition = logoY - 30; // Espacio de 30px debajo del logo
    page.drawText('Factura de Compra', {
        x: 50,
        y: titleYPosition,
        size: 24,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Método de Pago: ${metodo}`, {
        x: 50,
        y: titleYPosition - 30, // Espacio de 30px debajo del título
        size: 12,
        color: rgb(0, 0, 0),
    });

    let yPosition = titleYPosition - 60; // Comenzar a dibujar productos 60px debajo del método de pago
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