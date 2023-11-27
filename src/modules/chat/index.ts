import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import { io as client } from "socket.io-client";

import { BodyMessageConversation, BodyMessageExtended } from './types';

const socket = client(`${process.env.SOCKET_PORT}`, { transports: ['websocket'] })

const prisma = new PrismaClient();

class ChatControllers {
  async find(request: Request, reply: Response) {
    const { use_logged_id, target_id } = request.query;

    if (!use_logged_id && !target_id) {
      return reply.status(400).end({ error: 'Params empty' })
    }

    return await prisma.chat.findFirst({
      where: {
        OR: [
          {
            first_member_id: `${target_id}`,
            second_member_id: `${use_logged_id}`,
          },
          {
            first_member_id: `${use_logged_id}`,
            second_member_id: `${target_id}`,
          }
        ]
      },
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };

  async create(request: Request, reply: Response) {
    const { use_logged_id, target_id, instance_id } = request.body;

    return prisma.chat.create({
      data: {
        first_member_id: `${use_logged_id}`,
        second_member_id: `${target_id}`,
        instance_id: `${instance_id}`
      }
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(400).end({ error }))
  };

  async send(request: Request, reply: Response){
    const body = request.body as any;
    // const body = request.body as BodyMessageConversation;
    // const body = request.body as BodyMessageExtended;

    // console.log('stringify: ', JSON.stringify(body.data));
    // console.log(body, null, 5);

    if (body.event === 'connection.update' && body.data.state === 'open') {
      socket.emit('instance_connected', {
        instance: body.instance,
        message: 'Instance Connected',
        status: true
      })
    }

    if(body.event === 'messages.upsert' && body.data.messageType === 'extendedTextMessage') {
      const verify_data: string = body.data?.remoteJid ? body.data?.remoteJid : body.data.key.remoteJid;
  
      const findUser = await prisma.user.findMany({
        where: {
          OR: [
            {
              number: `${verify_data.replace('@s.whatsapp.net', '')}`
            },
            {
              number: `${body.sender.replace('@s.whatsapp.net', '')}`
            }
          ]
        },
        select: {
          id: true
        }
      });
  
      if (findUser.length !== 2) return reply.status(404).send({ message: 'Number Not Found' });

      const find = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              first_member_id: findUser[0].id,
              second_member_id: findUser[1].id,
            },
            {
              first_member_id: findUser[1].id,
              second_member_id: findUser[0].id,
            }
          ]
        }
      });

      socket.emit('sendMessage', {
        room: find?.id,
        number: verify_data.replace('@s.whatsapp.net', ''),
        name: body.data.pushName,
        message: body.data.message.extendedTextMessage.text
      })
  
      return reply.status(201).send({ message: 'sender' });
    };

    if(body.event === 'messages.upsert' && body.data.messageType === 'conversation') {
      const verify_data: string = body.data?.remoteJid ? body.data?.remoteJid : body.data.key.remoteJid;
  
      const findUser = await prisma.user.findMany({
        where: {
          OR: [
            {
              number: `${verify_data.replace('@s.whatsapp.net', '')}`
            },
            {
              number: `${body.sender.replace('@s.whatsapp.net', '')}`
            }
          ]
        },
        select: {
          id: true
        }
      });
  
      if (findUser.length !== 2) return reply.status(404).send({ message: 'Number Not Found' });

      const find = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              first_member_id: findUser[0].id,
              second_member_id: findUser[1].id,
            },
            {
              first_member_id: findUser[1].id,
              second_member_id: findUser[0].id,
            }
          ]
        }
      });

      // console.log({ find });

      // console.log({
      //   status: 'conversation',
      //   room: find?.id,
      //   number: sender_format,
      //   name: body.data.pushName,
      //   message: body.data.message.conversation
      // });

      socket.emit('sendMessage', {
        room: find?.id,
        number: verify_data.replace('@s.whatsapp.net', ''),
        name: body.data.pushName,
        message: body.data.message.conversation
      })
  
      return reply.status(201).send({ message: 'sender' });
    };

  }
};

export {
  ChatControllers
}