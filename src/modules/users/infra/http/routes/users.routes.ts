import { Router } from 'express';
import multer from 'multer';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import CreateUser from '@modules/users/services/CreateUserService';
import UpdateUserAvatar from '@modules/users/services/UpdateUserAvatarService';
import uploadConfig from '@config/upload';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const userRepository = new UserRepository();
  const { name, email, password } = request.body;

  const createUser = new CreateUser(userRepository);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const userRepository = new UserRepository();
    const updateUserAvatar = new UpdateUserAvatar(userRepository);
    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
