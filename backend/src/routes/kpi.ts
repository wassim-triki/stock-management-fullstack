import express, { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Supplier } from '../models/Supplier';
import { Client } from '../models/Client';
import { Invoice } from '../models/Invoice'; // Import Invoice
import { User, ROLES } from '../models/User';
import { SuccessResponse } from '../types/types';
import moment from 'moment';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const userRole = req.user?.role;

  let totalProductQuantity,
    uniqueProducts,
    outOfStockProducts,
    totalClients,
    totalSuppliers,
    totalUsers,
    totalRevenue = 0, // Initialize as a number
    lastMonthRevenue = 0, // Initialize as a number
    newClients = 0,
    newSuppliers = 0,
    newUsers = 0;

  // Date range for "recent" calculations (e.g., new entities added in the last 30 days)
  const lastMonth = moment().subtract(30, 'days').toDate();
  const thisMonthStart = moment().startOf('month').toDate();
  const lastMonthStart = moment()
    .subtract(1, 'month')
    .startOf('month')
    .toDate();
  const lastMonthEnd = moment().subtract(1, 'month').endOf('month').toDate();

  if (userRole === ROLES.ADMIN) {
    // Admin: Get global data
    totalProductQuantity = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$quantityInStock' } } },
    ]);
    uniqueProducts = await Product.countDocuments();
    outOfStockProducts = await Product.countDocuments({ quantityInStock: 0 }); // Count out-of-stock products

    totalClients = await Client.countDocuments();
    totalSuppliers = await Supplier.countDocuments();
    totalUsers = await User.countDocuments();

    // Growth: entities added in the last month
    newClients = await Client.countDocuments({
      createdAt: { $gte: lastMonth },
    });
    newSuppliers = await Supplier.countDocuments({
      createdAt: { $gte: lastMonth },
    });
    newUsers = await User.countDocuments({ createdAt: { $gte: lastMonth } });

    // Revenue for this month (Invoices)
    const currentRevenueResult = await Invoice.aggregate([
      {
        $match: {
          invoiceType: 'Client',
          paymentStatus: { $in: ['Paid', 'Partially Paid'] },
          createdAt: { $gte: thisMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);
    totalRevenue = currentRevenueResult?.[0]?.total || 0; // Access the first element and total

    // Revenue for last month (Invoices)
    const lastMonthRevenueResult = await Invoice.aggregate([
      {
        $match: {
          invoiceType: 'Client',
          paymentStatus: { $in: ['Paid', 'Partially Paid'] },
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);
    lastMonthRevenue = lastMonthRevenueResult?.[0]?.total || 0; // Access the first element and total
  } else if (userRole === ROLES.MANAGER) {
    // Manager: Get data relevant to the specific manager
    totalProductQuantity = await Product.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$quantityInStock' } } },
    ]);
    uniqueProducts = await Product.countDocuments({ user: userId });
    outOfStockProducts = await Product.countDocuments({
      user: userId,
      quantityInStock: 0,
    }); // Count out-of-stock products for this manager

    totalClients = await Client.countDocuments({ user: userId });
    totalSuppliers = await Supplier.countDocuments({ user: userId });

    newClients = await Client.countDocuments({
      user: userId,
      createdAt: { $gte: lastMonth },
    });
    newSuppliers = await Supplier.countDocuments({
      user: userId,
      createdAt: { $gte: lastMonth },
    });

    // Revenue for this month (Invoices)
    const currentRevenueResult = await Invoice.aggregate([
      {
        $match: {
          user: userId,
          invoiceType: 'Client',
          paymentStatus: { $in: ['Paid', 'Partially Paid'] },
          createdAt: { $gte: thisMonthStart },
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);
    totalRevenue = currentRevenueResult?.[0]?.total || 0; // Access the first element and total

    // Revenue for last month (Invoices)
    const lastMonthRevenueResult = await Invoice.aggregate([
      {
        $match: {
          user: userId,
          invoiceType: 'Client',
          paymentStatus: { $in: ['Paid', 'Partially Paid'] },
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);
    lastMonthRevenue = lastMonthRevenueResult?.[0]?.total || 0; // Access the first element and total
  }

  // Calculate revenue growth, defaulting to 0% instead of 'N/A'
  const revenueGrowth =
    lastMonthRevenue > 0
      ? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(
          1
        )
      : '0.0'; // Default to 0.0% if there's no last month revenue

  const clientGrowth = ((newClients / (totalClients || 1)) * 100).toFixed(1);
  const supplierGrowth = ((newSuppliers / (totalSuppliers || 1)) * 100).toFixed(
    1
  );
  const userGrowth = ((newUsers / (totalUsers || 1)) * 100).toFixed(1);

  res.status(200).json(
    new SuccessResponse("KPI's retrieved", {
      clients: {
        total: totalClients,
        new: newClients,
        growth: `${clientGrowth}%`,
      },
      suppliers: {
        total: totalSuppliers,
        new: newSuppliers,
        growth: `${supplierGrowth}%`,
      },
      products: {
        total: (totalProductQuantity && totalProductQuantity[0]?.total) || 0, // Total quantity in stock
        unique: uniqueProducts, // Number of unique products
        outOfStock: outOfStockProducts, // Number of out of stock products
      },
      revenue: {
        total: totalRevenue,
        growth: `${revenueGrowth}%`,
      },
      ...(userRole === ROLES.ADMIN && {
        users: {
          total: totalUsers,
          new: newUsers,
          growth: `${userGrowth}%`,
        },
      }),
    })
  );
});

export default router;
