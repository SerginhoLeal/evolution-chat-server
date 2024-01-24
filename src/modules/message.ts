import { Request, Response } from 'express';
import { io as client } from "socket.io-client";

import { prisma, cloudinary } from '../services';

interface RequestProps extends Request {
  id?: string;
}

const socket = client(`${process.env.BASE_URL}`, { transports: ['websocket'] })

class MessagesControllers {
  async index(request: RequestProps, reply: Response) {
    const { room_id } = request.query;

    const data = await prisma.message.findMany({
      where: {
        room_id: `${room_id}`
      },
    });

    return reply.status(201).json(data);
  };

  async messages(request: RequestProps, reply: Response) {
    const user_id = request.id;

    const { room_id } = request.query;
    const { message } = request.body;

    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
    });

    const data = {
      room_id: `${room_id}`,
      name: `${user?.nickname}`,
      number: `${user?.number}`,
      message_type: 'text',
      file: null,
      width: null,
      height: null,
      message: `${message}`,
    }

    const result = await prisma.message.create({ data });

    socket.emit('send_message', data);
    socket.emit('evolution-notification-request', {
      room_id,
      isRead: true,
      data: new Date(),
    })

    return reply.status(201).json(result);
  };

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

  async media_file(request: RequestProps, reply: Response) {
    const user_id = request.id;
    const { room_id } = request.query;

    const result = await prisma.message.findMany({
      where: {
        OR: [
          {
            room_id: `${room_id}`,
            message_type: 'image'
          },
          {
            room_id: `${room_id}`,
            message_type: 'video'
          },
        ]
      }
    });

    return reply.status(201).json(result);
  }
};

export {
  MessagesControllers
}

// {
//   "event": "messages.upsert",
//   "instance": "instance_3_553175564133",
//   "data": {
//        "key": {
//             "remoteJid": "553175564133@s.whatsapp.net",
//             "fromMe": true,
//             "id": "3A0F7EEB168268B7490F"
//        },
//        "pushName": "Sergio Leal",
//        "message": {
//             "conversation": "Vvvvjfif"
//        },
//        "messageType": "conversation",
//        "messageTimestamp": 1705684315,
//        "owner": "instance_3_553175564133",
//        "source": "ios"
//   },
//   "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
//   "date_time": "2024-01-19T14:11:55.534Z",
//   "sender": "553175564133@s.whatsapp.net",
//   "server_url": "api.whatsapp.laks.net.br",
//   "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
// }

//   "instance": "instance_3_553175564133",
//   "data": {
//        "key": {
//             "remoteJid": "553188808613@s.whatsapp.net",
//             "fromMe": true,
//             "id": "3A970E348D6DF043397A"
//        },
//        "pushName": "Sergio Leal",
//        "message": {
//             "conversation": "Mas pera, quais são os perigos de ir numa cachoeira com chuva?"
//        },
//        "messageType": "conversation",
//        "messageTimestamp": 1705685128,
//        "owner": "instance_3_553175564133",
//        "source": "ios"
//   },
//   "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
//   "date_time": "2024-01-19T14:25:28.277Z",
//   "sender": "553175564133@s.whatsapp.net",
//   "server_url": "api.whatsapp.laks.net.br",
//   "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
// }
//   "instance": "instance_3_553175564133",
//   "data": {
//        "key": {
//             "remoteJid": "553188808613@s.whatsapp.net",
//             "fromMe": true,
//             "id": "3A8CF9315D202511E026"
//        },
//        "pushName": "Sergio Leal",
//        "message": {
//             "conversation": "É muito boom"
//        },
//        "messageType": "conversation",
//        "messageTimestamp": 1705685136,
//        "owner": "instance_3_553175564133",
//        "source": "ios"
//   },
//   "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
//   "date_time": "2024-01-19T14:25:36.634Z",
//   "sender": "553175564133@s.whatsapp.net",
//   "server_url": "api.whatsapp.laks.net.br",
//   "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"