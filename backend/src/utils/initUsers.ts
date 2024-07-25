import { User as UserModel } from '../models/User';
import { ROLES } from './constants';
import { User } from '../types/types';

const initUsers = async () => {
  await UserModel.deleteMany({});

  const users: Partial<User>[] = Array.from({ length: 20 }, (_, index) => ({
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
};

export default initUsers;
