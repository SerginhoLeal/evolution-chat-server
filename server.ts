import express from 'express';
import cors from 'cors';

import { Server } from "socket.io";
import { io as SocketIo } from "socket.io-client";

import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient()

// const TEST_URL = 'https://evolution-chat.onrender.com';
const TEST_URL = 'http://localhost:3000';

const socket = SocketIo(TEST_URL, { transports: ['websocket'] })

app.use(express.json({ limit: '1gb' }));
app.use(cors());

let users: any[] = [];

let chats = [
  { // me && laura
    room_id: 'clpclotx80001edbnuk9yzz9n',
    destination: 'db',
    first_member_id: '05abe21d-3049-43f8-a842-5fb2af40d8f1',
    second_member_id: 'badd34de-ae07-4c0a-9c68-aaf17f94f32d',
    chat_messages: [
      {
        number: '553175564133',
        name: 'serginho',
        message: 'bom dia, amor ❤',
        send_at: '2023-11-22 17:26:06'
      }
    ]
  },
  { // me && laura
    room_id: 'clpcngx0h00018b4iw8bk1cgg',
    destination: 'db',
    first_member_id: "05abe21d-3049-43f8-a842-5fb2af40d8f1",
    second_member_id: "ecb500ed-4128-4f46-851f-61c0ed43f4f9",
    chat_messages: [
      {
        number: '553172363441',
        name: 'luiz',
        message: 'salve seu gay',
        send_at: '2023-11-22 17:26:06'
      }
    ]
  },
];

app.post('/api/login-user', async(request, reply) => {
  const { name, number } = request.body;
  
  return prisma.user.findFirst({
    where: {
      name: `${name}`,
      number: `${number}`
    }
  })
    .then(success => reply.status(201).json(success))
    .catch(error => reply.status(404).end({ error }))
});

app.post('/api/register-user', async(request, reply) => {
  const { name, number } = request.body;

  return await prisma.user.create({
    data: {
      name: `${name}`,
      number: `${number}`
    }
  })
    .then(success => reply.status(201).json(success))
    .catch(error => reply.status(404).end({ error }))
})

app.get('/api/get-chat', async(request, reply) => {
  const { user_id, target_id } = request.query;

  if (!user_id && !target_id) {
    return reply.status(400).end({ error: 'Params empty' })
  }

  return await prisma.chat.findFirst({
    where: {
      OR: [
        {
          first_member_id: `${target_id}`,
          second_member_id: `${user_id}`,
        },
        {
          first_member_id: `${user_id}`,
          second_member_id: `${target_id}`,
        }
      ]
    },
  })
    .then(success => {
      const find = chats.find(chat => chat.room_id === success.id)
      return reply.status(201).json(find)
    })
    .catch(error => reply.status(404).end({ error }))
});

app.post('/api/create-instance', async(request, reply) => {
  const { user_id, target_id } = request.query;

  return await prisma.instance.create({
    data: {
      instance_name: 'whatsapp_instance_sergio'
    }
  })
    .then(success => reply.status(201).json(success))
    .catch(error => reply.status(404).end({ error }))
})

app.post('/api/create-chat', async(request, reply) => {
  const { user_id, target_id, instance_id } = request.query;

  return await prisma.chat.create({
    data: {
      first_member_id: `${user_id}`,
      second_member_id: `${target_id}`,
      instance_id: `${instance_id}`
    }
  })
    .then(success => reply.status(201).json(success))
    .catch(error => reply.status(404).end({ error }))
})

app.post('/api/send-message', async(request, reply) => {
  const { room, userId } = request.query as any;
  const { message } = request.body as any;

  socket.emit('sendServerMessage', { room, userId, message })

  const data = {
    room,
    userId,
    message
  }

  return reply.status(201).send(data);
})

app.post('/api/webhook', async(request, reply) => {
  const body = request.body as any;

  console.log(body);

  // // numero de quem enviou
  // const slice_sender_one = body.sender.slice(0, 4);
  // const slice_sender_two = body.sender.slice(4, 12);

  // // numero de quem recebeu
  // const slice_target_one = body.data.key.remoteJid.slice(0, 4);
  // const slice_target_two = body.data.key.remoteJid.slice(4, 12);

  // if (body.event === 'messages.upsert'){

  //     const format = (value: string) => {
  //       if (value === '5531975564133') {
  //         return '5fe9c787-4610-4132-998d-186f66f6129d'
  //       };
  //       if (value === '5531984106645') {
  //         return '02a82085-93ea-4e4e-8f39-a73cb2812f11'
  //       };

  //       return ''
  //     }

  //     const find = await prisma.chat.findFirst({
  //       where: {
  //         OR: [
  //           {
  //             first_member_id: format(`${slice_sender_one}9${slice_sender_two}`),
  //             second_member_id: format(`${slice_target_one}9${slice_target_two}`),
  //           },
  //           {
  //             first_member_id: format(`${slice_target_one}9${slice_target_two}`),
  //             second_member_id: format(`${slice_sender_one}9${slice_sender_two}`),
  //           }
  //         ]
  //       }
  //     });

  //     socket.emit('sendServerMessage', {
  //       room: find?.id,
  //       number: `${slice_target_one}9${slice_target_two}`,
  //       name: body.data.pushName,
  //       message: body.data.message.conversation
  //     })

  //     return reply.status(201).send(find);

  // }

  return reply.status(201).send({ body })
})

const express_server = app.listen({ port: process.env.PORT || 3000 })

const io = new Server(express_server, {
  cors: {
    origin: '*'
  }
});

io.on("connection", (socket) => {
  socket.on("add_new_user", ({ id, name, number }) => {
    !users.some(user => user.id === id) &&
    users.push({
      id,
      name,
      number,
      socketId: socket.id
    })

    io.emit('get_online_users', users);
  });

  socket.on("on_join_room", ({ room, userId }) => {
    socket.join(room);

    // socket.broadcast
    //   .to(room)
    //   .emit("message", {
    //     message_id: 0,
    //     number: '5531975564134',
    //     username: 'Marco',
    //     message: 'Obrigado pelo contato, logo logo atenderei você, por favor aguarde!'
    //   });
  });


  // Listen for chatMessage
  socket.on("sendMessage", (data) => {

    io.to(data.room).emit("message", {
      number: data.number,
      name: data.name,
      message: data.message
    });
  });

  socket.on("sendServerMessage", (data) => {

    io.to(data.room).emit("message", {
      number: data.number,
      name: data.name,
      message: data.message
    });
  });

  socket.on('disconnect', () => {
    users = users.filter(users => users.socketId !== socket.id)
    io.emit('get_online_users', users);
  });
});


/*

{
  event: "messages.upsert",
  instance: "whatsapp_instance_sergio",
  data: {
    key: {
      remoteJid: "553199668527@s.whatsapp.net",
      fromMe: true,
      id: "3A00221F512CE7F9F521"
    },
    pushName: "Sergio Leal",
    message: { extendedTextMessage: [Object] },
    messageType: "extendedTextMessage",
    messageTimestamp: 1700759673,
    owner: "whatsapp_instance_sergio",
    source: "ios"
  },
  destination: "https://evolution-chat.onrender.com/api/webhook",
  date_time: "2023-11-23T14:14:33.241Z",
  sender: "553175564133@s.whatsapp.net",
  server_url: "api.whatsapp.laks.net.br",
  apikey: "E7EE1ADE-1AE5-4A78-8401-A708794F765A"
}
*/

/**
  {
Nov 8 03:20:06 PM    body: '{\n' +
Nov 8 03:20:06 PM      '     "event": "messages.upsert",\n' +
Nov 8 03:20:06 PM      '     "instance": "whatsapp_socket_sergio",\n' +
Nov 8 03:20:06 PM      '     "data": {\n' +
Nov 8 03:20:06 PM      '          "key": {\n' +
Nov 8 03:20:06 PM      '               "remoteJid": "553184106645@s.whatsapp.net",\n' +
Nov 8 03:20:06 PM      '               "fromMe": false,\n' +
Nov 8 03:20:06 PM      '               "id": "3AA181C5DEA31955E10E"\n' +
Nov 8 03:20:06 PM      '          },\n' +
Nov 8 03:20:06 PM      '          "pushName": "Marco Túlio Rocha",\n' +
Nov 8 03:20:06 PM      '          "message": {\n' +
Nov 8 03:20:06 PM      '               "conversation": "Oi",\n' +
Nov 8 03:20:06 PM      '               "messageContextInfo": {\n' +
Nov 8 03:20:06 PM      '                    "deviceListMetadata": {\n' +
Nov 8 03:20:06 PM      '                         "senderKeyHash": "Iqzioyzwfu9z8A==",\n' +
Nov 8 03:20:06 PM      '                         "senderTimestamp": "1699393900",\n' +
Nov 8 03:20:06 PM      '                         "recipientKeyHash": "gnVZb3aHjve4+g==",\n' +
Nov 8 03:20:06 PM      '                         "recipientTimestamp": "1699464114",\n' +
Nov 8 03:20:06 PM      '                         "recipientKeyIndexes": [\n' +
Nov 8 03:20:06 PM      '                              33\n' +
Nov 8 03:20:06 PM      '                         ]\n' +
Nov 8 03:20:06 PM      '                    },\n' +
Nov 8 03:20:06 PM      '                    "deviceListMetadataVersion": 2\n' +
Nov 8 03:20:06 PM      '               }\n' +
Nov 8 03:20:06 PM      '          },\n' +
Nov 8 03:20:06 PM      '          "messageType": "conversation",\n' +
Nov 8 03:20:06 PM      '          "messageTimestamp": 1699467605,\n' +
Nov 8 03:20:06 PM      '          "owner": "whatsapp_socket_sergio",\n' +
Nov 8 03:20:06 PM      '          "source": "ios"\n' +
Nov 8 03:20:06 PM      '     },\n' +
Nov 8 03:20:06 PM      '     "destination": "https://webhook-test-team-lead.onrender.com/webhook-lead",\n' +
Nov 8 03:20:06 PM      '     "date_time": "2023-11-08T15:20:06.091Z",\n' +
Nov 8 03:20:06 PM      '     "sender": "553175564133@s.whatsapp.net",\n' +
Nov 8 03:20:06 PM      '     "server_url": "api.whatsapp.laks.net.br",\n' +
Nov 8 03:20:06 PM      '     "apikey": "75DAAF33-B350-41B6-A17E-34B05E23FDF2"\n' +
Nov 8 03:20:06 PM      '}',
Nov 8 03:20:06 PM    url: '/webhook-lead'
Nov 8 03:20:06 PM  }


{
  "event": "messages.upsert",\n' +
  "instance": "whatsapp_socket_sergio",\n' +
  "data": {\n' +
      "key": {\n' +
            "remoteJid": "553184106645@s.whatsapp.net",\n' +
            "fromMe": false,\n' +
            "id": "3A6BC10EA2CE147638E2"\n' +
      },\n' +
      "pushName": "Marco Túlio Rocha",\n' +
      "message": {\n' +
            "conversation": "Oi",\n' +
            "messageContextInfo": {\n' +
                "deviceListMetadata": {\n' +
                      "senderKeyHash": "Iqzioyzwfu9z8A==",\n' +
                      "senderTimestamp": "1699393900",\n' +
                      "recipientKeyHash": "gnVZb3aHjve4+g==",\n' +
                      "recipientTimestamp": "1699464114",\n' +
                      "recipientKeyIndexes": [\n' +
                          33\n' +
                      ]\n' +
                },\n' +
                "deviceListMetadataVersion": 2\n' +
            }\n' +
      },\n' +
      "messageType": "conversation",\n' +
      "messageTimestamp": 1699467668,\n' +
      "owner": "whatsapp_socket_sergio",\n' +
      "source": "ios"\n' +
  },\n' +
  "destination": "https://webhook-test-team-lead.onrender.com/webhook-lead",\n' +
  "date_time": "2023-11-08T15:21:08.648Z",\n' +
  "sender": "553175564133@s.whatsapp.net",\n' +
  "server_url": "api.whatsapp.laks.net.br",\n' +
  "apikey": "75DAAF33-B350-41B6-A17E-34B05E23FDF2"\n' +
}

 */