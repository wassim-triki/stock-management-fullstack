import logging from '../config/logging';
import initUsers from './initUsers';
import initSuppliers from './initSuppliers';
import intiCategories from './intiCategories';

export const seedData = async () => {
  try {
    logging.log('Seeding...');
    logging.log('----------------------------------------');

    // Seed categories
    await intiCategories();

    // Seed users
    await initUsers();

    // Seed suppliers
    await initSuppliers();

    logging.log('Seeding done ✅.');
    logging.log('----------------------------------------');
  } catch (error) {
    logging.error('Error creating seed data:', error);
  }
};
