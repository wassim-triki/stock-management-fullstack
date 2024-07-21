// src/utils/seedData.ts
import { User } from '../models/User';
import { Supplier } from '../models/Supplier';
import logging from '../config/logging';
import { ROLES } from './constants';

export const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Supplier.deleteMany({});

    // Create users
    const users = [
      {
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
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '123-456-7890',
          address: {
            street: '123 Admin St',
            city: 'Admin City',
            state: 'Admin State',
            zip: '12345',
          },
        },
        role: ROLES.ADMIN,
      },
      {
        email: 'manager@example.com',
        password: 'password123',
        profile: {
          firstName: 'Manager',
          lastName: 'User',
          phone: '123-456-7890',
          address: {
            street: '123 Manager St',
            city: 'Manager City',
            state: 'Manager State',
            zip: '12345',
          },
        },
        role: ROLES.MANAGER,
      },
      {
        email: 'user@example.com',
        password: 'password123',
        profile: {
          firstName: 'Normal',
          lastName: 'User',
          phone: '123-456-7890',
          address: {
            street: '123 User St',
            city: 'User City',
            state: 'User State',
            zip: '12345',
          },
        },
        role: ROLES.USER,
      },
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    // Create suppliers
    const suppliers = [
      {
        companyName: 'Supplier One',
        contactName: 'Supplier One Contact',
        contactEmail: 'supplier1@example.com',
        phone: '123-456-7890',
        address: {
          street: '123 Supplier St',
          city: 'Supplier City',
          state: 'Supplier State',
          zip: '12345',
        },
      },
      {
        companyName: 'Supplier Two',
        contactName: 'Supplier Two Contact',
        contactEmail: 'supplier2@example.com',
        phone: '123-456-7890',
        address: {
          street: '456 Supplier St',
          city: 'Supplier City',
          state: 'Supplier State',
          zip: '67890',
        },
      },
    ];

    for (const supplierData of suppliers) {
      const supplier = new Supplier(supplierData);
      await supplier.save();
    }

    logging.log('Seed data created successfully.');
  } catch (error) {
    logging.error('Error creating seed data:', error);
  }
};
