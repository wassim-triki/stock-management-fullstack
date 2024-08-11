import PDFDocument from 'pdfkit';
import { IPurchaseOrder } from '../types/types';
import fs from 'fs';
// General function to generate a PDF from provided data
export const generatePDF = (
  type: 'purchaseOrder',
  data: any,
  path?: string
): PDFKit.PDFDocument => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  generateHeader(doc);

  switch (type) {
    case 'purchaseOrder':
      generatePurchaseOrderInformation(doc, data);
      generatePurchaseOrderTable(doc, data);
      break;

    // Other cases for different types of PDFs
    // case 'report':
    //   generateReportPDF(doc, data);
    //   break;

    default:
      throw new Error('Invalid PDF type');
  }

  generateFooter(doc);

  if (path) {
    doc.pipe(fs.createWriteStream(path));
  }

  doc.end();
  return doc;
};

// Function to generate a Purchase Order PDF (content part)
const generatePurchaseOrderTable = (
  doc: PDFKit.PDFDocument,
  orderData: IPurchaseOrder
) => {
  const itemsTableTop = 300;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    itemsTableTop,
    'Item',
    'Description',
    'Unit Price',
    'Quantity',
    'Line Total'
  );
  generateHr(doc, itemsTableTop + 20);
  doc.font('Helvetica');

  orderData.items.forEach((item, index: number) => {
    const position = itemsTableTop + (index + 1) * 30;
    generateTableRow(
      doc,
      position,
      `${item.product.name}`,
      item.product.description || 'N/A', // Add a description here if you have one
      `TND ${Number(item.unitPrice).toFixed(2)}`,
      item.quantity.toString(),
      `TND ${Number(item.lineTotal).toFixed(2)}`
    );

    generateHr(doc, position + 20);
  });

  const subtotalPosition = itemsTableTop + (orderData.items.length + 1) * 30;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Order Total',
    '',
    `TND ${orderData.orderTotal}`
  );
  doc.font('Helvetica');
};

// Header Section
function generateHeader(doc: PDFKit.PDFDocument) {
  const currentDate = formatDate(new Date());
  doc
    .image('logo.png', 50, 45, { width: 50 }) // Adjust the logo path
    .fillColor('#444444')
    .fontSize(20)
    .text('ACME Inc.', 110, 57)
    .fontSize(10)
    .text('ACME Inc.', 200, 50, { align: 'right' })
    .text('123 Main Street', 200, 65, { align: 'right' })
    .text('New York, NY, 10025', 200, 80, { align: 'right' })
    .text(`${currentDate}`, 200, 95, { align: 'right' })
    .moveDown();
}
function generatePurchaseOrderInformation(
  doc: PDFKit.PDFDocument,
  orderData: IPurchaseOrder
) {
  console.log(orderData, '❤️❤️❤️❤️');
  doc.fillColor('#444444').fontSize(20).text('Purchase order', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text('Order Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(orderData.orderNumber, 120, customerInformationTop)
    .font('Helvetica')
    .text('Order Date:', 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 105, customerInformationTop + 15)
    .text('Due Date:', 50, customerInformationTop + 30)
    .text(
      formatDate(new Date(orderData.orderDate)),
      102,
      customerInformationTop + 30
    )

    .font('Helvetica-Bold')
    .text(orderData.supplier.name, 350, customerInformationTop)
    .font('Helvetica')
    .text(orderData.supplier.email, 350, customerInformationTop + 15)
    .text(orderData.supplier.phone, 350, customerInformationTop + 30)
    .font('Helvetica')
    .text(orderData.supplier.address.street, 350, customerInformationTop + 45)
    .text(
      orderData.supplier.address.city + ', ' + orderData.supplier.address.state,
      350,
      customerInformationTop + 60
    )
    .moveDown();

  generateHr(doc, 285);
}

// Footer Section
function generateFooter(doc: PDFKit.PDFDocument) {
  doc.fontSize(10).text('Thank you for your business.', 50, 780, {
    align: 'center',
    width: 500,
  });
}

// Utility Functions
function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  item: string,
  description: string,
  unitPrice: string,
  quantity: string,
  lineTotal: string
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitPrice, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
}
