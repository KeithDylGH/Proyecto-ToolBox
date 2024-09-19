const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generarPdf = async (productos, metodoPago) => {
  return new Promise((resolve, reject) => {
    if (!productos || !Array.isArray(productos)) {
      return reject(new Error('No se proporcionaron productos válidos'));
    }

    const doc = new PDFDocument();
    let pdfPath = 'path/to/your/pdf/confirmacion.pdf'; // Ajusta la ruta según tus necesidades
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(25).text('Confirmación de Compra', { align: 'center' });

    doc.fontSize(18).text('Método de Pago: ' + metodoPago);
    
    productos.forEach((producto) => {
      doc.fontSize(14).text(`Producto: ${producto.nombre}`, { continued: true })
        .text(` Precio Unitario: $${producto.precio.toFixed(2)}`)
        .text(` Cantidad: ${producto.cantidad}`)
        .text(` Total: $${(producto.precio * producto.cantidad).toFixed(2)}`);
    });

    doc.end();

    doc.on('finish', () => {
      resolve(pdfPath);
    });

    doc.on('error', (err) => {
      reject(err);
    });
  });
};