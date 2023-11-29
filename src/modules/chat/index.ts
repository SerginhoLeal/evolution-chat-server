import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import { io as client } from "socket.io-client";

import { BodyMessageConversation, BodyMessageExtended } from './types';

const socket = client(`${process.env.SOCKET_PORT}`, { transports: ['websocket'] })

const prisma = new PrismaClient();

class ChatControllers {
  async find(request: Request, reply: Response) {
    const { use_logged_id, contact_id } = request.query;

    if (!use_logged_id && !contact_id) {
      return reply.status(400).end({ error: 'Params empty' })
    }

    return await prisma.chat.findFirst({
      where: {
        OR: [
          {
            user_id: `${contact_id}`,
            contact_id: `${use_logged_id}`,
          },
          {
            user_id: `${use_logged_id}`,
            contact_id: `${contact_id}`,
          }
        ]
      },
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };

  async create(request: Request, reply: Response) {
    const { use_logged_id, contact_id, instance_id } = request.body;

    return prisma.chat.create({
      data: {
        user_id: `${use_logged_id}`,
        contact_id: `${contact_id}`,
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
    console.log(body);

    if (body.event === 'connection.update' && body.data.state === 'open') {
      console.log('connection.update && open: ', body, 5);

      socket.emit('instance_connected', {
        instance: body.instance,
        message: 'Instance Connected',
        status: true
      })
    };

    if(body.event === 'messages.upsert' && body.data.messageType === 'extendedTextMessage') {
      console.log('messages.upsert && extendedTextMessage: ', body, 5);
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
              user_id: findUser[0].id,
              contact_id: findUser[1].id,
            },
            {
              user_id: findUser[1].id,
              contact_id: findUser[0].id,
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
      console.log('messages.upsert && conversation: ', body, 5);
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
              user_id: findUser[0].id,
              contact_id: findUser[1].id,
            },
            {
              user_id: findUser[1].id,
              contact_id: findUser[0].id,
            }
          ]
        }
      });

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