import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/model/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashpProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ name, email, password }: IRequest): Promise<User> {
    const checkIfUserExists = await this.userRepository.findByEmail(email);

    if (checkIfUserExists) {
      throw new AppError({ message: 'Email address already used.' });
    }
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
