import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';

import CreateUser from '@modules/users/services/CreateUserService';
import UpdateUserAvatar from '@modules/users/services/UpdateUserAvatarService';
import uploadConfig from '@config/upload';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = container.resolve(CreateUser);

  const user = await createUser.execute({
    name,
    email,
    password,
  });
  const { password: _, ...responseUser } = user;

  return response.json(responseUser);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = container.resolve(UpdateUserAvatar);
    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    const { password: _, ...responseUser } = user;

    return response.json(responseUser);
  },
);

export default usersRouter;
