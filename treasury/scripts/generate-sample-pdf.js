const PdfPrinter = require('pdfmake');
const fs = require('fs');

const fonts = { Roboto: { normal: 'node_modules/pdfmake/build/vfs_fonts.js' } };
const printer = new PdfPrinter(fonts);
const docDefinition = {
  content: [ { text: 'تقرير تجريبي', style: 'header', alignment: 'right' }, 'مرحبا' ],
  defaultStyle: { alignment: 'right' }
};
const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('sample.pdf'));
pdfDoc.end();

