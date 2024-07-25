import { Supplier } from '../models/Supplier';

const initSuppliers = async () => {
  await Supplier.deleteMany({});

  const suppliers = Array.from({ length: 20 }, (_, index) => ({
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
};

export default initSuppliers;
