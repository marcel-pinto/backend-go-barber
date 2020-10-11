import path from 'path';
import { promises as fs } from 'fs';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

@injectable()
export default class UpdateAvatarService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError({
        message: 'Only authenticated users can change the avatar.',
        statusCode: 401,
      });
    }

    if (user.avatar) {
      // Deletar o avatar antigo do usuario
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.stat(userAvatarFilePath);

      if (userAvatarFileExists) await fs.unlink(userAvatarFilePath);
    }

    user.avatar = avatarFilename;

    await this.userRepository.save(user);

    return user;
  }
}
