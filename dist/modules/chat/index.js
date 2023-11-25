"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/chat/index.ts
var chat_exports = {};
__export(chat_exports, {
  ChatControllers: () => ChatControllers
});
module.exports = __toCommonJS(chat_exports);
var import_client = require("@prisma/client");
var import_socket = require("socket.io-client");
var socket = (0, import_socket.io)(`${process.env.SOCKET_PORT}`, { transports: ["websocket"] });
var prisma = new import_client.PrismaClient();
var ChatControllers = class {
  async find(request, reply) {
    const { use_logged_id, target_id } = request.query;
    if (!use_logged_id && !target_id) {
      return reply.status(400).end({ error: "Params empty" });
    }
    return await prisma.chat.findFirst({
      where: {
        OR: [
          {
            first_member_id: `${target_id}`,
            second_member_id: `${use_logged_id}`
          },
          {
            first_member_id: `${use_logged_id}`,
            second_member_id: `${target_id}`
          }
        ]
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async create(request, reply) {
    const { use_logged_id, target_id, instance_id } = request.query;
    return await prisma.chat.create({
      data: {
        first_member_id: `${use_logged_id}`,
        second_member_id: `${target_id}`,
        instance_id: `${instance_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async send(request, reply) {
    const body = request.body;
    console.log("stringify: ", JSON.stringify(body.data.key.remoteJid));
    console.log("parse: ", JSON.parse(body.data.key.remoteJid));
    const findUser = await prisma.user.findMany({
      where: {
        OR: [
          {
            number: `${body.data.key.remoteJid.replace("@s.whatsapp.net", "")}`
          },
          {
            number: `${body.sender.replace("@s.whatsapp.net", "")}`
          }
        ]
      },
      select: {
        id: true
      }
    });
    console.log(body, null, 5);
    if (findUser.length !== 2)
      return reply.status(404).send({ message: "Number Not Found" });
    const sender_format = body.sender.replace("@s.whatsapp.net", "");
    if (body.event === "messages.upsert" && body.data.messageType === "extendedTextMessage") {
      const find = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              first_member_id: findUser[0].id,
              second_member_id: findUser[1].id
            },
            {
              first_member_id: findUser[1].id,
              second_member_id: findUser[0].id
            }
          ]
        }
      });
      socket.emit("sendMessage", {
        room: find?.id,
        number: sender_format,
        name: body.data.pushName,
        message: body.data.message.extendedTextMessage.text
      });
      return reply.status(201).send({ message: "sender" });
    }
    ;
    if (body.event === "messages.upsert" && body.data.messageType === "conversation") {
      const find = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              first_member_id: findUser[0].id,
              second_member_id: findUser[1].id
            },
            {
              first_member_id: findUser[1].id,
              second_member_id: findUser[0].id
            }
          ]
        }
      });
      socket.emit("sendMessage", {
        room: find?.id,
        number: sender_format,
        name: body.data.pushName,
        message: body.data.message.conversation
      });
      return reply.status(201).send({ message: "sender" });
    }
    ;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatControllers
});
