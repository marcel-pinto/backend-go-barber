import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUser from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUser);

    const user = await createUser.execute({
      name,
      email,
      password,
    });
    const { password: _, ...responseUser } = user;

    return response.json(responseUser);
  }
}