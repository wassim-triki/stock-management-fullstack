import mongoose from 'mongoose';
import { ICategory } from '../types/types';
import { Category } from '../models/Category';

// Define categories with potential parent-child relationships
const categories = [
  { name: 'Electronics', parent: null },
  { name: 'Computers & Tablets', parent: 'Electronics' },
  { name: 'Mobile Phones', parent: 'Electronics' },
  { name: 'Cameras', parent: 'Electronics' },
  { name: 'Audio', parent: 'Electronics' },
  { name: 'Home Appliances', parent: null },
  { name: 'Kitchen Appliances', parent: 'Home Appliances' },
  { name: 'Laundry Appliances', parent: 'Home Appliances' },
  { name: 'Heating & Cooling', parent: 'Home Appliances' },
  { name: 'Furniture', parent: null },
  { name: 'Living Room Furniture', parent: 'Furniture' },
  { name: 'Bedroom Furniture', parent: 'Furniture' },
  { name: 'Office Furniture', parent: 'Furniture' },
  { name: 'Clothing', parent: null },
  { name: "Men's Clothing", parent: 'Clothing' },
  { name: "Women's Clothing", parent: 'Clothing' },
  { name: "Kids' Clothing", parent: 'Clothing' },
  { name: 'Sports & Outdoors', parent: null },
  { name: 'Exercise & Fitness', parent: 'Sports & Outdoors' },
  { name: 'Outdoor Recreation', parent: 'Sports & Outdoors' },
  { name: 'Team Sports', parent: 'Sports & Outdoors' },
];

const initCategories = async () => {
  await Category.deleteMany({});

  // Map for storing parent categories by name
  const categoryMap: { [key: string]: mongoose.Types.ObjectId } = {};

  // First, create categories without parents
  for (const categoryData of categories) {
    if (!categoryData.parent) {
      const category = new Category({ name: categoryData.name });
      await category.save();
      categoryMap[categoryData.name] = category._id as mongoose.Types.ObjectId;
    }
  }

  // Then, create categories with parents
  for (const categoryData of categories) {
    if (categoryData.parent) {
      const parentId = categoryMap[categoryData.parent];
      if (parentId) {
        const category = new Category({
          name: categoryData.name,
          parentCategory: parentId,
        });
        await category.save();
        categoryMap[categoryData.name] =
          category._id as mongoose.Types.ObjectId;
      }
    }
  }
};

export default initCategories;
