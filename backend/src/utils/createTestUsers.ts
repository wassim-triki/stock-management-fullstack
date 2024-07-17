import mongoose from 'mongoose';
import { User } from '../models/User';
import { StreamDescription } from 'mongodb';

export const createTestUsers = async () => {
  await User.deleteMany({});

  const users = [
    {
      password: 'password123',
      email: 'testuser1@example.com',
      profile: {
        firstName: 'Test',
        lastName: 'User1',
        phone: '1234567890',
        address: {
          street: '123 Main St',
          city: 'Test City',
          state: 'Test State',
          zip: '12345',
        },
      },
      active: true,
    },
  ];

  try {
    await User.insertMany(users);
    console.log('Test users created successfully');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    // await mongoose.connection.close();
  }
};
