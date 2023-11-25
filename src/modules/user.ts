import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

class UserControllers {
  async login(request: Request, reply: Response) {
    const { name, number } = request.body;
  
    return prisma.user.findFirst({
      where: {
        name: `${name}`,
        number: `${number}`
      }
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };

  async register(request: Request, reply: Response) {
    const { name, number } = request.body;

    return await prisma.user.create({
      data: {
        name: `${name}`,
        number: `${number}`
      }
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };
};

export {
  UserControllers
}