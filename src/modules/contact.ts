import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

class ContactControllers {
  async register(request: Request, reply: Response) {
    const { name, number } = request.body;

    return await prisma.contact.create({
      data: {
        name: `${name}`,
        number: `${number}`
      }
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };

  async delete(request: Request, reply: Response) {
    const { use_logged_id } = request.query;

    return await prisma.contact.delete({
      where: {
        id: `${use_logged_id}`
      },
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };
};

export {
  ContactControllers
}