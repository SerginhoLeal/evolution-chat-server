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
    const { use_logged_id, contact_id } = request.query;
    if (!use_logged_id && !contact_id) {
      return reply.status(400).end({ error: "Params empty" });
    }
    return await prisma.chat.findFirst({
      where: {
        OR: [
          {
            user_id: `${contact_id}`,
            contact_id: `${use_logged_id}`
          },
          {
            user_id: `${use_logged_id}`,
            contact_id: `${contact_id}`
          }
        ]
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async create(request, reply) {
    const { use_logged_id, contact_id, instance_id } = request.body;
    return prisma.chat.create({
      data: {
        user_id: `${use_logged_id}`,
        contact_id: `${contact_id}`,
        instance_id: `${instance_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(400).end({ error }));
  }
  async send(request, reply) {
    const body = request.body;
    console.log("body: ");
    console.log(body, null, 5);
    if (body.event === "connection.update" && body.data.state === "open") {
      socket.emit("instance_connected", {
        instance: body.instance,
        message: "Instance Connected",
        status: true
      });
    }
    ;
    if (body.event === "messages.upsert" && body.data.messageType === "extendedTextMessage") {
      const verify_data = body.data?.remoteJid ? body.data?.remoteJid : body.data.key.remoteJid;
      const findUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              number: `${verify_data.replace("@s.whatsapp.net", "")}`
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
      const findContact = await prisma.contact.findFirst({
        where: {
          OR: [
            {
              number: `${verify_data.replace("@s.whatsapp.net", "")}`
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
      if (!findUser && !findContact)
        return reply.status(404).send({ message: "Number Not Found" });
      const find = await prisma.chat.findFirst({
        where: {
          user_id: findUser?.id,
          contact_id: findContact?.id
        }
      });
      socket.emit("sendMessage", {
        room: find?.id,
        number: verify_data.replace("@s.whatsapp.net", ""),
        name: body.data.pushName,
        message: body.data.message.extendedTextMessage.text
      });
      return reply.status(201).send({ message: "sender" });
    }
    ;
    if (body.event === "messages.upsert" && body.data.messageType === "conversation") {
      const verify_data = body.data?.remoteJid ? body.data?.remoteJid : body.data.key.remoteJid;
      const findUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              number: `${verify_data.replace("@s.whatsapp.net", "")}`
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
      const findContact = await prisma.contact.findFirst({
        where: {
          OR: [
            {
              number: `${verify_data.replace("@s.whatsapp.net", "")}`
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
      if (!findUser && !findContact)
        return reply.status(404).send({ message: "Number Not Found" });
      const find = await prisma.chat.findFirst({
        where: {
          user_id: findUser?.id,
          contact_id: findContact?.id
        }
      });
      socket.emit("sendMessage", {
        room: find?.id,
        number: verify_data.replace("@s.whatsapp.net", ""),
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
