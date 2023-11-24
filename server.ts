import express from 'express';
import cors from 'cors';

import { Server } from "socket.io";
import { io as SocketIo } from "socket.io-client";

import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient()

const TEST_URL = 'https://evolution-chat.onrender.com';
// const TEST_URL = 'http://localhost:3000';

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
  { // me && luiz
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
  { // me && me
    room_id: 'clpcnlfsl0001xexrcqdwrlx0',
    destination: 'db',
    first_member_id: "05abe21d-3049-43f8-a842-5fb2af40d8f1",
    second_member_id: "05abe21d-3049-43f8-a842-5fb2af40d8f1",
    chat_messages: [
      {
        number: '553172363441',
        name: 'serginho',
        message: 'Teste',
        send_at: '2023-11-22 17:26:06'
      }
    ]
  },
  { // me && marco
    room_id: '553184106645',
    destination: 'db',
    first_member_id: "05abe21d-3049-43f8-a842-5fb2af40d8f1",
    second_member_id: "5f1aaf98-740a-466f-aaab-2c74dbfc7004",
    chat_messages: [
      {
        number: '553172363441',
        name: 'luiz',
        message: 'Salve marco',
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

  socket.emit('sendMessage', { room, userId, message })

  const data = {
    room,
    userId,
    message
  }

  return reply.status(201).send(data);
})

/*
  {
    event: 'messages.upsert',
    instance: 'whatsapp_instance_sergio',
    data: {
      key: {
        remoteJid: '553175564133@s.whatsapp.net',
        fromMe: true,
        id: '3AA64AC482E95FF0798F'
      },
      pushName: 'Sergio Leal',
      message: { conversation: 'Salvei 2' },
      messageType: 'conversation',
      messageTimestamp: 1700835590,
      owner: 'whatsapp_instance_sergio',
      source: 'ios'
    },
    destination: 'https://evolution-chat.onrender.com/api/webhook',
    date_time: '2023-11-24T11:19:50.442Z',
    sender: '553175564133@s.whatsapp.net',
    server_url: 'api.whatsapp.laks.net.br',
    apikey: 'E7EE1ADE-1AE5-4A78-8401-A708794F765A'
  }

{
  event: 'messages.upsert',
  instance: 'whatsapp_instance_sergio',
  data: {
    key: {
      remoteJid: '553196604728@s.whatsapp.net',
      fromMe: false,
      id: '8849B945438975F4C25BC0B78F24BB4F'
    },
    pushName: 'Maria Goreti Rosa',
    message: { extendedTextMessage: [Object], messageContextInfo: [Object] },
    messageType: 'extendedTextMessage',
    messageTimestamp: 1700836088,
    owner: 'whatsapp_instance_sergio',
    source: 'android'
  },
  destination: 'https://evolution-chat.onrender.com/api/webhook',
  date_time: '2023-11-24T11:28:08.625Z',
  sender: '553175564133@s.whatsapp.net',
  server_url: 'api.whatsapp.laks.net.br',
  apikey: 'E7EE1ADE-1AE5-4A78-8401-A708794F765A'
}

{
     "event": "messages.upsert",
     "instance": "whatsapp_instance_sergio",
     "data": {
          "key": {
               "remoteJid": "553199668527@s.whatsapp.net",
               "fromMe": true,
               "id": "3EB0E5226B8A631E36A06E"
          },
          "pushName": "Sergio Leal",
          "message": {
               "extendedTextMessage": {
                    "text": "é assim que começa",
                    "contextInfo": {
                         "stanzaId": "2F0C1BF027EBAFBAB650D16D3C685EE1",
                         "participant": "553199668527@s.whatsapp.net",
                         "quotedMessage": {
                              "documentWithCaptionMessage": {
                                   "message": {
                                        "documentMessage": {
                                             "url": "https://mmg.whatsapp.net/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&mms3=true",
                                             "mimetype": "application/zip",
                                             "fileSha256": "ye+JnBblLNOsIgkh+egqHx9fIEB6/zNZOjCnEF6rOM8=",
                                             "fileLength": "1372777",
                                             "pageCount": 0,
                                             "mediaKey": "i5I1oPhV9a13ilYrHVFAElG66+I6fzvW3IrEb9DFlvA=",
                                             "fileEncSha256": "MBb6rhM9qL/iXnCKDaTHi1LanhVzQWzsUo6byNLOJao=",
                                             "directPath": "/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&_nc_hot=1700828779",
                                             "mediaKeyTimestamp": "1700784082",
                                             "contactVcard": false,
                                             "caption": "Anna Bella project zip.zip"
                                        }
                                   }
                              }
                         }
                    },
                    "inviteLinkGroupTypeV2": "DEFAULT"
               }
          },
          "messageType": "extendedTextMessage",
          "messageTimestamp": 1700836715,
          "owner": "whatsapp_instance_sergio",
          "source": "android"
     },
     "destination": "https://evolution-chat.onrender.com/api/webhook",
     "date_time": "2023-11-24T11:38:35.955Z",
     "sender": "553175564133@s.whatsapp.net",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "E7EE1ADE-1AE5-4A78-8401-A708794F765A"
}

*/

interface BodyMessageExtended {
  event: string; //'messages.upsert',
  instance: string; //'whatsapp_instance_sergio',
  data: {
    key: {
      remoteJid: string; //'553196604728@s.whatsapp.net',
      fromMe: boolean; //false,
      id: string; //'8849B945438975F4C25BC0B78F24BB4F'
    },
    pushName: string; //'Maria Goreti Rosa',
    message: {
      extendedTextMessage: {
        text: string; // "é assim que começa",
        contextInfo: {
          stanzaId: string; // "2F0C1BF027EBAFBAB650D16D3C685EE1",
          participant: string; // "553199668527@s.whatsapp.net",
          quotedMessage: {
            documentWithCaptionMessage: {
              message: {
                documentMessage: {
                  url: string; // "https://mmg.whatsapp.net/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&mms3=true",
                  mimetype: string; // "application/zip",
                  fileSha256: string; // "ye+JnBblLNOsIgkh+egqHx9fIEB6/zNZOjCnEF6rOM8=",
                  fileLength: string; // "1372777",
                  pageCount: number; // 0,
                  mediaKey: string; // "i5I1oPhV9a13ilYrHVFAElG66+I6fzvW3IrEb9DFlvA=",
                  fileEncSha256: string; // "MBb6rhM9qL/iXnCKDaTHi1LanhVzQWzsUo6byNLOJao=",
                  directPath: string; // "/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&_nc_hot=1700828779",
                  mediaKeyTimestamp: string; // "1700784082",
                  contactVcard: boolean; // false,
                  caption: string; // "Anna Bella project zip.zip"
                }
              }
            }
          }
        },
        inviteLinkGroupTypeV2: string; // "DEFAULT"
      },
      messageContextInfo: {
  
      }
    },
    messageType: 'extendedTextMessage'; //'extendedTextMessage',
    messageTimestamp: number; // 1700836088,
    owner: string; //'whatsapp_instance_sergio',
    source: string; //'android'
  },
  destination: string; //'https://evolution-chat.onrender.com/api/webhook',
  date_time: string; //'2023-11-24T11:28:08.625Z',
  sender: string; //'553175564133@s.whatsapp.net',
  server_url: string; //'api.whatsapp.laks.net.br',
  apikey: string; //'E7EE1ADE-1AE5-4A78-8401-A708794F765A'
}

interface BodyMessageConversation {
  event: 'messages.upsert',
  instance: 'whatsapp_instance_sergio',
  data: {
    key: {
      remoteJid: '553175564133@s.whatsapp.net',
      fromMe: true,
      id: '3AA64AC482E95FF0798F'
    },
    pushName: 'Sergio Leal',
    message: { conversation: 'Salvei 2' },
    messageType: 'conversation',
    messageTimestamp: 1700835590,
    owner: 'whatsapp_instance_sergio',
    source: 'ios'
  },
  destination: 'https://evolution-chat.onrender.com/api/webhook',
  date_time: '2023-11-24T11:19:50.442Z',
  sender: string; // '553175564133@s.whatsapp.net',
  server_url: 'api.whatsapp.laks.net.br',
  apikey: 'E7EE1ADE-1AE5-4A78-8401-A708794F765A'
}

app.post('/api/webhook', async(request, reply) => {
  const body = request.body as BodyMessageConversation;

  const format = (value: string) => {
    if (value === '553175564133') return '05abe21d-3049-43f8-a842-5fb2af40d8f1';
    if (value === '553184106645') return '5f1aaf98-740a-466f-aaab-2c74dbfc7004';
    if (value === '553171868572') return 'badd34de-ae07-4c0a-9c68-aaf17f94f32d';
    if (value === '553172363441') return 'ecb500ed-4128-4f46-851f-61c0ed43f4f9';

    return ''
  };
  
  console.log(body);

  if (
    body.sender === '553175564133@s.whatsapp.net' || body.sender === '553184106645@s.whatsapp.net' ||
    body.sender === '553171868572@s.whatsapp.net' || body.sender === '553172363441@s.whatsapp.net'
    ) {

    const sender_format = body.sender.replace('@s.whatsapp.net', '');
    const target_format = body.data.key.remoteJid.replace('@s.whatsapp.net', '');

    if(body.event === 'messages.upsert' && body.data.messageType === 'extendedTextMessage') {
      const find = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              first_member_id: format(sender_format),
              second_member_id: format(target_format),
            },
            {
              first_member_id: format(target_format),
              second_member_id: format(sender_format),
            }
          ]
        }
      });
  
      if (!find) return reply.status(404).send({ message: 'not found' });
      // console.log(find?.id);
      // console.log(target_format);
      // console.log(body.data.pushName);
      // console.log(body.data.message.conversation);
      socket.emit('sendMessage', {
        room: find?.id,
        number: sender_format,
        name: body.data.pushName,
        message: body.data.message.conversation
      })
  
      return reply.status(201).send({ message: 'sender' });
    };
  
    if(body.event === 'messages.upsert' && body.data.messageType === 'conversation') {
      const find = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              first_member_id: format(sender_format),
              second_member_id: format(target_format),
            },
            {
              first_member_id: format(target_format),
              second_member_id: format(sender_format),
            }
          ]
        }
      });
  
      if (!find) return reply.status(404).send({ message: 'not found' });
  
      socket.emit('sendMessage', {
        room: find?.id,
        number: sender_format,
        name: body.data.pushName,
        message: body.data.message.conversation
      })
  
      return reply.status(201).send({ message: 'sender' });
    };
  }

  return reply.status(201).send({ message: 'received' })
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
