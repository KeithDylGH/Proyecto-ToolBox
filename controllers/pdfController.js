const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generarPDF(datosCompra) {
    // Crea un nuevo PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { nombreCliente, productos } = datosCompra;

    // Establecer los márgenes
    const margin = 50;
    const yStart = page.getHeight() - margin;
    let yPosition = yStart;

    // Añadir el título
    page.drawText('Confirmación de Compra', {
        x: margin,
        y: yPosition,
        size: 24,
        color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // Añadir nombre del cliente
    page.drawText(`Nombre del Cliente: ${nombreCliente}`, {
        x: margin,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Añadir lista de productos
    page.drawText('Productos Comprados:', {
        x: margin,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Recorre la lista de productos
    productos.forEach(producto => {
        page.drawText(`- ${producto.nombre} - Precio: $${producto.precio.toFixed(2)} - Cantidad: ${producto.cantidad}`, {
            x: margin,
            y: yPosition,
            size: 12,
            color: rgb(0, 0, 0),
        });
        yPosition -= 15; // Espaciado entre productos
    });

    // Añadir total
    const totalCompra = productos.reduce((acc, producto) => acc + (producto.precio * (producto.cantidad || 1)), 0);
    yPosition -= 10; // Espacio antes del total
    page.drawText(`Total a Pagar: $${totalCompra.toFixed(2)}`, {
        x: margin,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
    });

    // Guarda el PDF en un archivo
    const pdfBytes = await pdfDoc.save();
    const filePath = path.join(__dirname, 'tmp', 'confirmacion_compra.pdf');
    fs.writeFileSync(filePath, pdfBytes);

    return filePath;
}

module.exports = { generarPDF };