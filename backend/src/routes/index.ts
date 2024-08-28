import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import productRouter from './product';
import supplierRouter from './supplier';
import categoryRouter from './category';
import purchaseOrderRouter from './purchaseOrder';
import invoiceRouter from './invoice';
import companyRouter from './company';
import clientRouter from './client';
import kpiRouter from './kpi';
import currencyRouter from './currency';
const routes = Router();

routes.use('/api/auth', authRouter);
routes.use('/api/users', userRouter);
routes.use('/api/products', productRouter);
routes.use('/api/invoices', invoiceRouter);
routes.use('/api/clients', clientRouter);
routes.use('/api/suppliers', supplierRouter);
routes.use('/api/categories', categoryRouter);
routes.use('/api/purchase-orders', purchaseOrderRouter);
routes.use('/api/companies', companyRouter);
routes.use('/api/kpi', kpiRouter);
routes.use('/api/currencies', currencyRouter);

export default routes;
