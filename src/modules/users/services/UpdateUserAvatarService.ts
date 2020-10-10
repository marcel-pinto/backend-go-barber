import { getRepository } from 'typeorm';
import path from 'path';
import { promises as fs } from 'fs';

import User from '../infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface Request {
  userId: string;
  avatarFilename: string;
}

export default class UpdateAvatarService {
  public async execute({ userId, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(userId);

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

    await userRepository.save(user);

    return user;
  }
}
