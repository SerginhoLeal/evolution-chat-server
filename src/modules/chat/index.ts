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

    console.log("body: ");
    console.log(JSON.stringify(body, null, 5));

    if (body.event === 'connection.update' && body.data.state === 'open') {
      socket.emit('instance_connected', {
        instance: body.instance,
        message: 'Instance Connected',
        status: true
      })
    };

    if(body.event === 'messages.upsert' && body.data.messageType === 'extendedTextMessage') {
      const verify_data: string = body.data?.remoteJid ? body.data?.remoteJid : body.data.key.remoteJid;
  
      const findUser = await prisma.user.findFirst({
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

      const findContact = await prisma.contact.findFirst({
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

      if (!findUser && !findContact) return reply.status(404).send({ message: 'Number Not Found' });

      const find = await prisma.chat.findFirst({
        where: {
          user_id: findUser?.id,
          contact_id: findContact?.id,
        }
      });

      console.log({ 
        room: find?.id,
        number: verify_data.replace('@s.whatsapp.net', ''),
        name: body.data.pushName,
        message: body.data.message.extendedTextMessage.text
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
  
      const findUser = await prisma.user.findFirst({
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

      const findContact = await prisma.contact.findFirst({
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
  
      if (!findUser && !findContact) return reply.status(404).send({ message: 'Number Not Found' });

      const find = await prisma.chat.findFirst({
        where: {
          user_id: findUser?.id,
          contact_id: findContact?.id,
        }
      });

      console.log({
        room: find?.id,
        number: verify_data.replace('@s.whatsapp.net', ''),
        name: body.data.pushName,
        message: body.data.message.extendedTextMessage.text
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