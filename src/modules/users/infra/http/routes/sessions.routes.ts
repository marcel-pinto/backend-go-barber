import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUser from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUser = container.resolve(AuthenticateUser);
  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  const { password: _, ...responseUser } = user;

  return response.json({ responseUser, token });
});

export default sessionsRouter;
