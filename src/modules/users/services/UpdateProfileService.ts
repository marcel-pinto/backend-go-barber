import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError({ message: 'User not found.' });
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError({ message: 'E-mail already in use.' });
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError({
        message: 'You need to inform the old password to set a new password.',
      });
    }

    if (password && old_password) {
      const oldPasswordMatched = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!oldPasswordMatched) {
        throw new AppError({ message: 'Old password does not match.' });
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}