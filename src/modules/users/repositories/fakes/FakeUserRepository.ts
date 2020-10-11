import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';

class UserRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const foundUser = this.users.find(user => user.id === id);
    return foundUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = this.users.find(user => user.email === email);
    return foundUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), ...userData });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const foundIndex = this.users.findIndex(u => user.id === u.id);

    this.users[foundIndex] = user;
    return user;
  }
}

export default UserRepository;
