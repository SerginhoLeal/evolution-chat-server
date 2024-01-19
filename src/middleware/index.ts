import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

export const PRIVATE = '2615948';

export default (request: Request, reply: Response, next: NextFunction ) => {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.includes('Bearer')) {
    return reply.status(401).send('no_token_provided');
  }

  const [, token] = authorization.split(' ');

  try {
    const payload: any = jwt.verify(token, PRIVATE);

    request.id = payload.id;

    return next();
  } catch (e: any) {
    return reply.status(401).send('token_invalid');
  }
}