import { inject, injectable } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const foundUserToken = await this.userTokensRepository.findByToken(token);

    if (!foundUserToken) {
      throw new AppError({ message: 'A token for this user does not exists' });
    }

    const user = await this.userRepository.findById(foundUserToken.user_id);

    if (!user) {
      throw new AppError({ message: 'User does not exists' });
    }

    const tokenCreatedAt = foundUserToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError({ message: 'Token expired' });
    }
    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}
