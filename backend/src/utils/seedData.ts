import logging from '../config/logging';
import initUsers from './initUsers';
import initSuppliers from './initSuppliers';
import intiCategories from './intiCategories';
import initProducts from './initProducts';

export const seedData = async () => {
  try {
    logging.log('Seeding...');
    logging.log('----------------------------------------');
    // await initUsers();
    // await initSuppliers();
    // await intiCategories();
    // await initProducts();

    logging.log('Seeding done ✅.');
    logging.log('----------------------------------------');
  } catch (error) {
    logging.error('Error creating seed data:', error);
  }
};
