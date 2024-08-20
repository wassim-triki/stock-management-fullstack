import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import productRouter from './product';
import supplierRouter from './supplier';
import categoryRouter from './category';
import purchaseOrderRouter from './purchaseOrder';
import supplierInvoiceRouter from './supplierInvoice';
const routes = Router();

routes.use('/api/auth', authRouter);
routes.use('/api/users', userRouter);
routes.use('/api/products', productRouter);
routes.use('/api/suppliers/invoices', supplierInvoiceRouter);
routes.use('/api/suppliers', supplierRouter);
routes.use('/api/categories', categoryRouter);
routes.use('/api/purchase-orders', purchaseOrderRouter);

export default routes;
