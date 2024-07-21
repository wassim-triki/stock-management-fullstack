import { IUser } from '../types';

export {};

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
