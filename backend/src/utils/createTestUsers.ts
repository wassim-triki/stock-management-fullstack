import mongoose from 'mongoose';
import { User } from '../models/User';

export const createTestUsers = async () => {
  await User.deleteMany({});

  const users = [
    {
      username: 'testuser1',
      password: 'password123',
      email: 'testuser1@example.com',
      profile: {
        firstName: 'Test',
        lastName: 'User1',
        avatar: '',
        bio: 'This is a test user',
        phone: '1234567890',
        gender: 'male',
        address: {
          street1: '123 Main St',
          street2: '',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          zip: '12345',
          location: {
            type: 'Point',
            coordinates: [100.0, 0.0],
          },
        },
      },
      active: true,
    },
    {
      username: 'testuser2',
      password: 'password123',
      email: 'testuser2@example.com',
      profile: {
        firstName: 'Test',
        lastName: 'User2',
        avatar: '',
        bio: 'This is a test user',
        phone: '1234567890',
        gender: 'female',
        address: {
          street1: '456 Another St',
          street2: '',
          city: 'Another City',
          state: 'Another State',
          country: 'Another Country',
          zip: '67890',
          location: {
            type: 'Point',
            coordinates: [100.0, 0.0],
          },
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
