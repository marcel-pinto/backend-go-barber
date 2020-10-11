import { container } from 'tsyringe';

import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';
import IHashProvider from './HashProvider/model/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
