import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate a user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeAppointmentsRepository = new FakeUserRepository();
    const authenticateUserService = new AuthenticateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a non existing user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeAppointmentsRepository = new FakeUserRepository();
    const authenticateUserService = new AuthenticateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider,
    );

    expect(
      authenticateUserService.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a wrong password', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeAppointmentsRepository = new FakeUserRepository();
    const authenticateUserService = new AuthenticateUserService(
      fakeAppointmentsRepository,
      fakeHashProvider,
    );
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
      authenticateUserService.execute({
        email: 'johndoe@example.com',
        password: 'wrong password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
