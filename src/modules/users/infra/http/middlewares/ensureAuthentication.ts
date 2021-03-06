import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { authorization: authHeader } = request.headers;

  if (!authHeader) {
    throw new AppError({ message: 'JWT token is missing', statusCode: 401 });
  }
  const [, token] = authHeader.split(' ');

  const { secret } = authConfig.jwt;
  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError({ message: 'Invalid JWT token', statusCode: 401 });
  }
}
