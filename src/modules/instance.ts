import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class InstanceControllers {
  async find(request: Request, reply: Response) {
    const { use_logged_id } = request.query;

    return prisma.instance.findMany({
      where: {
        user_id: `${use_logged_id}`
      },
      include: {
        chat: {
          include: {
            second_member: true
          }
        }
      }
    })
      .then(success => {
        if (success.length === 0) {
          return reply.status(201).json({ data: success, status: 'empty', message: 'Create an Instance' });
        };
        return reply.status(201).json({ data: success, status: 'data', message: `Returned ${success.length} instances` })
      })
      .catch(error => reply.status(404).end({ error }))
  };

  async create(request: Request, reply: Response) {
    const { use_logged_id } = request.query;
    const { instance_name } = request.body;

    return await prisma.instance.create({
      data: {
        instance_name,
        user_id: `${use_logged_id}`
      }
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };

  async delete(request: Request, reply: Response) {
    const { use_logged_id, instance_id } = request.query;

    return await prisma.instance.delete({
      where: {
        id: `${instance_id}`,
        user_id: `${use_logged_id}`
      },
    })
      .then(success => reply.status(201).json({ message: `instance ${success.instance_name} deleted` }))
      .catch(error => reply.status(404).end({ error }))
  }
};

export { InstanceControllers };
