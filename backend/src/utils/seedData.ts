// src/utils/seedData.ts
import { User as UserModel } from '../models/User';
import { Supplier } from '../models/Supplier';
import logging from '../config/logging';
import { ROLES } from './constants';
import { IUser, User } from '../types/types';

export const seedData = async () => {
  try {
    // Clear existing data
    await UserModel.deleteMany({});
    await Supplier.deleteMany({});
    console.log('Deleted data. ✅✅✅✅');

    // Create users
    const users: Partial<User>[] = Array.from({ length: 100 }, (_, index) => ({
      email: `user${index + 1}@example.com`,
      password: 'password123',
      profile: {
        firstName: `User ${index + 1}`,
        lastName: 'User',
        phone: '123-456-7890',
        address: {
          street: `${index + 1} User St`,
          city: 'User City',
          state: 'User State',
          zip: '12345',
        },
      },
      role: ROLES.USER,
    }));

    users.push({
      email: 'wsmtriki@gmail.com',
      password: 'wsmtriki1',
      profile: {
        firstName: 'Wassim',
        lastName: 'Triki',
        phone: '+21624542649',
        address: {
          street: '123 Admin St',
          city: 'Kelibia',
          state: 'Nabeul',
          zip: '8090',
        },
      },
      role: ROLES.ADMIN,
    });

    for (const userData of users) {
      const user = new UserModel(userData);
      await user.save();
    }

    //arrya of 100 items of suppliers
    //another one but for users  (100 users)
    //creat

    const suppliers = Array.from({ length: 100 }, (_, index) => ({
      name: `Supplier ${index + 1}`,
      email: `supplier${index + 1}@gmail.com`,
      phone: `+21624542649`,
      address: {
        street: `${index + 1} Supplier St`,
        city: 'Supplier City',
        state: 'Supplier State',
        zip: '12345',
      },
    }));

    for (const supplierData of suppliers) {
      const supplier = new Supplier(supplierData);
      await supplier.save();
    }

    logging.log('Seed data created successfully.');
    logging.log('----------------------------------------');
  } catch (error) {
    logging.error('Error creating seed data:', error);
  }
};
