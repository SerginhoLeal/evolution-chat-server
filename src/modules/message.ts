import { Request, Response } from 'express';
import { io as client } from "socket.io-client";

import { prisma, cloudinary } from '../services';

interface RequestProps extends Request {
  id?: string;
}

const socket = client(`${process.env.PRODUCTION_BASE_URL}`, { transports: ['websocket'] })

interface TypeConversation {
  "event": "messages.upsert",
  "instance": "instance_3_553175564133",
  "data": {
    "key": {
      "remoteJid": "553191819932@s.whatsapp.net",
      "fromMe": false,
      "id": "3A6687C4331054C34F0F"
    },
    "pushName": "Leila Fernanda",
    "message": {
      "conversation": "Eu te amo",
      "messageContextInfo": {
        "deviceListMetadata": {
          "senderTimestamp": "1705675528",
          "recipientKeyHash": "mlFwLjPVjSGbYQ==",
          "recipientTimestamp": "1705684155",
          "recipientKeyIndexes": [107]
        },
        "deviceListMetadataVersion": 2
      }
    },
    "messageType": "conversation",
    "messageTimestamp": 1705684429,
    "owner": "instance_3_553175564133",
    "source": "ios"
  },
  "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
  "date_time": "2024-01-19T14:13:49.253Z",
  "sender": "553175564133@s.whatsapp.net",
  "server_url": "api.whatsapp.laks.net.br",
  "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}

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
      message: `${message}`,
    }

    const result = await prisma.message.create({ data });

    socket.emit('send_message', data);

    return reply.status(201).json(result);
  };

  async messages_media(request: RequestProps, reply: Response) {
    const user_id = request.id;

    const element = request.file as { path: string, mimetype: 'image' | 'video', filename: string };

    const { room_id } = request.query;
    const { message } = request.body;

    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
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

    socket.emit('send_message', data);

    return reply.status(201).json(result);
  };

  // set the url to evolution
  // if (request.body.event === 'connection.update' && request.body.data.state === 'open') {
  //   console.log(JSON.stringify(request.body, null, 5));
  // }
  async message_by_whatsapp(request: RequestProps, reply: Response) {
    const body: TypeConversation = request.body;

    if (body.data.messageType === 'conversation' && body.data.message.conversation) {
      const contact = body.data.key.remoteJid.replace('@s.whatsapp.net', '');

      const data = {
        room_id: `${body.instance}`,
        name: `${body.data.pushName}`,
        number: `${contact}`,
        message_type: 'text',
        file: null,
        message: `${body.data.message.conversation}`,
      }

      const result = await prisma.message.create({ data });

      socket.emit('send_message', data);

      return reply.status(201).json(result);
    }

    return reply.status(404).json({ message: 'not found' });
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