import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatar from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarControoler {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatar);
    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    const { password: _, ...responseUser } = user;

    return response.json(responseUser);
  }
}
