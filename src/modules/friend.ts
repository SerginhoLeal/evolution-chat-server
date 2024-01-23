import { Request, Response } from 'express';

import { prisma } from '../services';

type RequestProps = Request & {
  id?: string;
}

class FriendControllers {
  async friends(request: RequestProps, reply: Response) {
    const user_id = request.id;
    // const cookieHeader = request.headers?.cookie;
    // console.log(cookieHeader);
    // const friend = await prisma.$queryRaw`
    //   select * from friends, (SELECT nickname, photo FROM users WHERE id = ${user_id})
    // `;

    // SELECT * FROM friends WHERE user_id = ${user_id} OR target_id = ${user_id},

    // #### - my user - ####
    // SELECT nickname, photo FROM users WHERE id = ${user_id}

    const friend = await prisma.friend.findMany({
      where: {
        OR: [
          { user_id: `${user_id}` },
          { target_id: `${user_id}` }
        ]
      },
      include: {
        target: {
          select: {
            id: true,
            nickname: true,
            photo: true,
            number: true,
          }
        },
        user: {
          select: {
            id: true,
            nickname: true,
            photo: true,
            number: true,
          }
        },
        messages: {
          take: -1,
          select: {
            message: true,
            message_type: true,
            created_at: true
          }
        },
      }
    });

    // return reply.cookie().status(201).json(friend);
    return reply.status(201).json(friend);
  }

  async friend(request: RequestProps, reply: Response) {
    const user_id = request.id;
    const { target_id } = request.query;

    return prisma.friend.findFirst({
      where: {
        OR: [
          {
            user_id: `${user_id}`,
            target_id: `${target_id}`
          },
          {
            user_id: `${target_id}`, 
            target_id: `${user_id}`
          }
        ]
      }
    })
      .then((data) => reply.status(201).json(data))
      .catch((error) => reply.status(400).json(error))
  }

  async create(request: RequestProps, reply: Response) {
    const user_id = request.id;
    const { target_id, type_chat } = request.body;

    return prisma.friend.create({
      data: {
        user_id: `${user_id}`,
        target_id: `${target_id}`,
        type_chat: `${type_chat}`
      }
    })
      .then((data) => reply.status(201).json(data))
      .catch((error) => reply.status(400).json(error))
  }
};

export {
  FriendControllers
}