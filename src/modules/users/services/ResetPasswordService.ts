import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
// import User from '../infra/typeorm/entities/User';
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

    user.password = password;

    await this.userRepository.save(user);
  }
}
