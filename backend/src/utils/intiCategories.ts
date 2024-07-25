// initCategories.ts
import mongoose from 'mongoose';
import { ICategory } from '../types/types';
import { Category } from '../models/Category';

const intiCategories = async () => {
  await Category.deleteMany({});
  const categories: Partial<ICategory>[] = [
    { name: 'Electronics' },
    { name: 'Computers & Tablets' },
    { name: 'Mobile Phones' },
    { name: 'Cameras' },
    { name: 'Audio' },
    { name: 'Home Appliances' },
    { name: 'Kitchen Appliances' },
    { name: 'Laundry Appliances' },
    { name: 'Heating & Cooling' },
    { name: 'Furniture' },
    { name: 'Living Room Furniture' },
    { name: 'Bedroom Furniture' },
    { name: 'Office Furniture' },
    { name: 'Clothing' },
    { name: "Men's Clothing" },
    { name: "Women's Clothing" },
    { name: "Kids' Clothing" },
    { name: 'Sports & Outdoors' },
    { name: 'Exercise & Fitness' },
    { name: 'Outdoor Recreation' },
    { name: 'Team Sports' },
  ];

  // Map for storing parent categories by name
  const categoryMap: { [key: string]: mongoose.Types.ObjectId } = {};

  // First, create parent categories and store their IDs in the map
  for (const categoryData of categories) {
    if (!categoryData.parentCategory) {
      const category = new Category({ name: categoryData.name });
      await category.save();
      if (categoryData.name) {
        categoryMap[categoryData.name] =
          category._id as mongoose.Types.ObjectId;
      }
    }
  }

  // Then, create child categories with the parentCategory field set
  for (const categoryData of categories) {
    const parentName = categoryData.name!.split(' ')[0];
    const parentId = categoryMap[parentName];
    if (parentId) {
      const category = new Category({
        name: categoryData.name,
        parentCategory: parentId,
      });
      await category.save();
    }
  }
};

export default intiCategories;
