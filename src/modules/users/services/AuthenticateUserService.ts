import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new AppError({
        message: 'Incorrect email/password combination',
        statusCode: 401,
      });

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError({
        message: 'Incorrect email/password combination',
        statusCode: 401,
      });
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });
    return {
      user,
      token,
    };
  }
}
