import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new appointment', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeAppointmentsRepository = new FakeUserRepository();
    const createUserService = new CreateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same email', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeAppointmentsRepository = new FakeUserRepository();
    const createUserService = new CreateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider,
    );

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
