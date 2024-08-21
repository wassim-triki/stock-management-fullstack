import { ROLES, User as UserModel } from '../models/User';
import { User } from '../types/types';

const initUsers = async () => {
  await UserModel.deleteMany({});

  const users: Partial<User>[] = [];

  // TODO: add generic admin
  users.push({
    email: 'admin@admin.com',
    password: 'adminadmin',
    role: ROLES.ADMIN,
  });

  for (const userData of users) {
    const user = new UserModel(userData);
    await user.save();
  }
};

export default initUsers;
