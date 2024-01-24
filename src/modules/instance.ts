import { Request, Response } from 'express';
import { io as client } from "socket.io-client";

import { cloudinary, evolution_api, prisma } from '../services';
import { MessageTypeConversationProps, WebhookConnecting, MessageTypeExtendedProps } from '../types';

const socket = client(`${process.env.BASE_URL}`, { transports: ['websocket'] });

interface RequestProps extends Request {
  id?: string;
  query: {
    room_id: string;
    instance: string;
    number: string;
  },
  body: MessageTypeExtendedProps & {
    message: string;
    width: string;
    height: string;
  };
}

export class InstanceControllers {
  async connect(request: Request, reply: Response) {
    const { instance } = request.query;

    const { data } = await evolution_api.get(`/instance/connect/${instance}`);

    return reply.status(201).json(data);
  }

  async webhook(request: Request, reply: Response) {
    const body = request.body;

    // console.log(body);

    if (body.event === 'connection.update' && body.data.state === 'open') {
      socket.emit('evolution-api-connect', { 
        message: `instance ${body.instance} connected`,
        status: 'success',
        instance_name: body.instance
      });
    }

    if (body.data.messageType === 'conversation' && body.data.message.conversation) {
      const contact = body.data.key.remoteJid.replace('@s.whatsapp.net', ''); // who sends
      const me = body.sender.replace('@s.whatsapp.net', ''); // instance phone connected

      const data = await prisma.user.findMany({
        where: {
          OR: [
            { number: `${contact.slice(0, 4)}9${contact.slice(4, 12)}` },
            { number: `${me.slice(0, 4)}9${me.slice(4, 12)}` },
          ]
        }
      });

      if (data.length !== 2) return 'error';

      const room = await prisma.friend.findFirst({
        where: {
          OR: [
            {
              user_id: `${data[0].id}`,
              target_id: `${data[1].id}`,
            },
            {
              user_id: `${data[1].id}`,
              target_id: `${data[0].id}`,
            }
          ]
        }
      })

      const constructor = {
        room_id: `${room?.id}`,
        name: `${body.data.pushName}`,
        number: `${contact}`,
        message_type: 'text',
        file: null,
        message: `${body.data.message.conversation}`,
      }

      const result = await prisma.message.create({ data: constructor });

      socket.emit('send_message', result);

      return reply.status(201).json(result);
    }

    if (body.data.messageType === 'extendedTextMessage' && body.data.message.extendedTextMessage.text) {
      const contact = body.data.key.remoteJid.replace('@s.whatsapp.net', ''); // who sends
      const me = body.sender.replace('@s.whatsapp.net', ''); // instance phone connected

      const data = await prisma.user.findMany({
        where: {
          OR: [
            { number: `${contact.slice(0, 4)}9${contact.slice(4, 12)}` },
            { number: `${me.slice(0, 4)}9${me.slice(4, 12)}` },
          ]
        }
      });

      if (data.length !== 2) return 'error';

      const room = await prisma.friend.findFirst({
        where: {
          OR: [
            {
              user_id: `${data[0].id}`,
              target_id: `${data[1].id}`,
            },
            {
              user_id: `${data[1].id}`,
              target_id: `${data[0].id}`,
            }
          ]
        }
      })

      const constructor = {
        room_id: `${room?.id}`,
        name: `${body.data.pushName}`,
        number: `${contact}`,
        message_type: 'text',
        file: null,
        message: `${body.data.message.extendedTextMessage.text}`,
      }

      const result = await prisma.message.create({ data: constructor });

      socket.emit('send_message', result);

      return reply.status(201).json(result);
    }

    return reply.status(401).json({ message: 'no' });
  }

  async platform_to_whatsapp(request: RequestProps, reply: Response) {
    const user_id = request.id;

    const { room_id, instance, number } = request.query;
    const { message } = request.body;

    const contact = `${number.slice(0, 4)}${number.slice(5, 13)}`

    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
    });

    const data = {
      room_id: `${room_id}`,
      name: `platform_${user?.nickname}`,
      number: `${user?.number}`,
      message_type: 'text',
      file: null,
      width: null,
      height: null,
      message: `${message}`,
    };

    const result = await prisma.message.create({ data });

    evolution_api.post(`/message/sendText/${instance}`, {
      number: contact,
      options: {
        delay: 1500,
        presence: "composing",
        linkPreview: false
      },
      textMessage: {
        text: `${message}`
      }
    })

    socket.emit('send_message', result)

    return reply.status(201).json({ message: 'success' });
  }

  async messages_media(request: RequestProps, reply: Response) {
    const user_id = request.id;

    const { room_id } = request.query;
    const { message, width, height } = request.body;

    const element = request.file as { path: string, mimetype: 'image' | 'video', filename: string };

    const randomId = `${Math.random()} size_image`;

    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
    });

    socket.emit('send_preview_image_or_video', {
      randomId,
      room_id,
      name: `${user?.nickname}`,
      number: `${user?.number}`,
      message_type: 'preloading',
      width,
      height,
    });
    
    const upload: any = await cloudinary.v2.uploader.upload(element.path, {
      resource_type: `${element.mimetype}`,
      public_id: `evo/${element.filename}`,
      overwrite: true,
    });

    const data = {
      room_id: `${room_id}`,
      name: `${user?.nickname}`,
      number: `${user?.number}`,
      message_type: `${element.mimetype}`,
      file: upload.url,
      width: `${upload.width}`,
      height: `${upload.height}`,
      message: `${message}`,
    };

    const result = await prisma.message.create({ data });

    socket.emit('send_message', {
      ...data,
      randomId
    });

    return reply.status(201).json(result);
  };
};
