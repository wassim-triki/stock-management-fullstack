import { Supplier } from '../models/Supplier';

const initSuppliers = async () => {
  await Supplier.deleteMany({});

  const aplhabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const suppliers = aplhabet.map((letter) => ({
    name: `Supplier ${letter}`,
    email: `supplier${letter}@gmail.com`,
    phone: `+21624542649`,
    address: {
      street: `${letter} Supplier St`,
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
