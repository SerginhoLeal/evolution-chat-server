import { Request, Response } from 'express';

import jwt, { sign } from 'jsonwebtoken';

import { prisma } from '../services';

class UserControllers {
  async login(request: Request, reply: Response) {
    const { nickname, password } = request.body;

    const data = await prisma.user.findFirst({
      where: {
        nickname: `${nickname}`,
        password: `${password}`,
      }
    })

    if (!data) {
      return reply.status(404).json({ message: 'User does not exist' })
    };

    const token = jwt.sign(data, '2615948');

    return reply
    .cookie('evoToken', token,  { maxAge: 86400 })
    .status(201).json({data, token});
    // .status(201).json(data);
  };

  async register(request: Request, reply: Response) {
    const { name, nickname, email, password, number, photo } = request.body;

    return prisma.user.create({
      data: {
        name: `${name}`,
        nickname: `${nickname}`,
        password: `${password}`,
        email: `${email}`,
        number: `${number}`,
        photo: `${photo}`
      }
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };

  async put(request: Request, reply: Response) {

  }

  async delete(request: Request, reply: Response) {
    const { use_logged_id } = request.query;

    return await prisma.user.delete({
      where: {
        id: `${use_logged_id}`
      },
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };
};

export {
  UserControllers
}