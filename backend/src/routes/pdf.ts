import express from 'express';
import pdf from 'html-pdf';
import pdfTemplate from '../templates/orderPdf';
import { Supplier } from '../models/Supplier';
import { ErrorResponse, HttpCode } from '../types/types';
import { getNextOrderNumber } from '../models/PurchaseOrder';
import { Product } from '../models/Product';
const router = express.Router();

router.post('/generate', async (req, res) => {
  const { supplier: supplierId, items } = req.body;
  const supplier = await Supplier.findById(supplierId);
  if (!supplier)
    throw new ErrorResponse('Supplier not found', HttpCode.NOT_FOUND);

  // const itemsObjects = Promise.all([
  //   ...(items as []).map(async (item: any) => {
  //     const product = await Product.findById(item.product);
  //     if (!product)
  //       throw new ErrorResponse('Product not found', HttpCode.NOT_FOUND);
  //     return {
  //       product,
  //       quantity: item.quantity,
  //       price: item.price,
  //       lineTotal: item.lineTotal,
  //     };
  //   }),
  // ]);
  const orderNumber = await getNextOrderNumber();
  console.log(req.body);
  pdf
    .create(pdfTemplate({ ...req.body, supplier, orderNumber }), {})
    .toFile('result.pdf', (err, fileInfo) => {
      if (err) {
        throw new ErrorResponse(
          'Error generating PDF',
          HttpCode.INTERNAL_SERVER_ERROR
        );
      }
      res.sendFile(`${__dirname}/result.pdf`);
    });
  res.end();
});

export default router;
