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
      // .then(success => {
      //   const find = chats.find(chat => chat.room_id === success?.id)
      //   return reply.status(201).json(find)
      // })
      .catch(error => reply.status(404).end({ error }))
  };

  async create(request: Request, reply: Response) {
    const { use_logged_id, target_id, instance_id } = request.query;

    return await prisma.chat.create({
      data: {
        first_member_id: `${use_logged_id}`,
        second_member_id: `${target_id}`,
        instance_id: `${instance_id}`
      }
    })
      .then(success => reply.status(201).json(success))
      .catch(error => reply.status(404).end({ error }))
  };

  async send(request: Request, reply: Response){
    const body = request.body as any;
    // const body = request.body as BodyMessageConversation;
    // const body = request.body as BodyMessageExtended;

    const findUser = await prisma.user.findMany({
      where: {
        OR: [
          {
            number: `${body.data.key.remoteJid.replace('@s.whatsapp.net', '')}`
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
  
    const sender_format = body.sender.replace('@s.whatsapp.net', '');

    if(body.event === 'messages.upsert' && body.data.messageType === 'extendedTextMessage') {
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

      console.log({ find });

      console.log({
        status: 'extendedTextMessage',
        room: find?.id,
        number: sender_format,
        name: body.data.pushName,
        message: body.data.message.conversation
      });

      socket.emit('sendMessage', {
        room: find?.id,
        number: sender_format,
        name: body.data.pushName,
        message: body.data.message.extendedTextMessage.text
      })
  
      return reply.status(201).send({ message: 'sender' });
    };

    if(body.event === 'messages.upsert' && body.data.messageType === 'conversation') {
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

      console.log({ find });

      console.log({
        status: 'conversation',
        room: find?.id,
        number: sender_format,
        name: body.data.pushName,
        message: body.data.message.conversation
      });

      socket.emit('sendMessage', {
        room: find?.id,
        number: sender_format,
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
