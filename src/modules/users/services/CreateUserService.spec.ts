import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeUserRepository();
    const createUserService = new CreateUserService(fakeAppointmentsRepository);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same email', async () => {
    const fakeAppointmentsRepository = new FakeUserRepository();
    const createUserService = new CreateUserService(fakeAppointmentsRepository);

    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
