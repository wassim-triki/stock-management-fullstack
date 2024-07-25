import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Supplier } from '../models/Supplier';

const initProducts = async () => {
  // Delete all existing products
  await Product.deleteMany({});

  // Fetch categories and suppliers
  const electronicsCategory = await Category.findOne({ name: 'Electronics' });
  const furnitureCategory = await Category.findOne({ name: 'Furniture' });
  const clothingCategory = await Category.findOne({ name: 'Clothing' });

  const supplierA = await Supplier.findOne({ name: 'Supplier 1' });
  const supplierB = await Supplier.findOne({ name: 'Supplier 2' });

  if (
    !electronicsCategory ||
    !furnitureCategory ||
    !clothingCategory ||
    !supplierA ||
    !supplierB
  ) {
    throw new Error('Required categories or suppliers not found');
  }

  // List of products to be seeded
  const products = [
    {
      name: 'Smartphone X',
      description: 'Latest model smartphone with all the features you need.',
      price: 699.99,
      quantityInStock: 50,
      // reorderLevel: 10,
      category: electronicsCategory._id,
      supplier: supplierA._id,
    },
    {
      name: 'Laptop Y',
      description: 'High-performance laptop for all your computing needs.',
      price: 999.99,
      quantityInStock: 30,
      // reorderLevel: 5,
      category: electronicsCategory._id,
      supplier: supplierA._id,
    },
    {
      name: 'Sofa Set Z',
      description: 'Comfortable and stylish sofa set for your living room.',
      price: 899.99,
      quantityInStock: 20,
      // reorderLevel: 5,
      category: furnitureCategory._id,
      supplier: supplierB._id,
    },
    {
      name: "Men's Jacket",
      description: 'Warm and fashionable jacket for men.',
      price: 199.99,
      quantityInStock: 100,
      // reorderLevel: 20,
      category: clothingCategory._id,
      supplier: supplierB._id,
    },
  ];

  // Save products to the database
  for (const productData of products) {
    const product = new Product(productData);
    await product.save();
  }
};

export default initProducts;
