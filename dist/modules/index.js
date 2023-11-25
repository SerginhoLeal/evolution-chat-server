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

// src/modules/index.ts
var modules_exports = {};
__export(modules_exports, {
  ChatControllers: () => ChatControllers,
  InstanceControllers: () => InstanceControllers,
  UserControllers: () => UserControllers
});
module.exports = __toCommonJS(modules_exports);

// src/modules/user.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var UserControllers = class {
  async login(request, reply) {
    const { name, number } = request.body;
    return prisma.user.findFirst({
      where: {
        name: `${name}`,
        number: `${number}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async register(request, reply) {
    const { name, number } = request.body;
    return await prisma.user.create({
      data: {
        name: `${name}`,
        number: `${number}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
};

// src/modules/chat/index.ts
var import_express = require("express");
var import_client2 = require("@prisma/client");
var import_socket = require("socket.io-client");
var socket = (0, import_socket.io)(`${process.env.SOCKET_PORT}`, { transports: ["websocket"] });
var prisma2 = new import_client2.PrismaClient();
var ChatControllers = class {
  async find(request, reply) {
    const { use_logged_id, target_id } = request.query;
    if (!use_logged_id && !target_id) {
      return reply.status(400).end({ error: "Params empty" });
    }
    return await prisma2.chat.findFirst({
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
    return await prisma2.chat.create({
      data: {
        first_member_id: `${use_logged_id}`,
        second_member_id: `${target_id}`,
        instance_id: `${instance_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async send(request, reply) {
    const body = request.body;
    const format = (value) => {
      if (value === "553175564133")
        return "05abe21d-3049-43f8-a842-5fb2af40d8f1";
      if (value === "553184106645")
        return "5f1aaf98-740a-466f-aaab-2c74dbfc7004";
      if (value === "553171868572")
        return "badd34de-ae07-4c0a-9c68-aaf17f94f32d";
      if (value === "553192363441")
        return "ecb500ed-4128-4f46-851f-61c0ed43f4f9";
      return "";
    };
    if (body.sender === "553175564133@s.whatsapp.net" || body.sender === "553184106645@s.whatsapp.net" || body.sender === "553171868572@s.whatsapp.net" || body.sender === "553192363441@s.whatsapp.net") {
      const sender_format = body.sender.replace("@s.whatsapp.net", "");
      const target_format = body.data.key.remoteJid.replace("@s.whatsapp.net", "");
      console.log(body);
      if (body.event === "messages.upsert" && body.data.messageType === "extendedTextMessage") {
        const find = await prisma2.chat.findFirst({
          where: {
            OR: [
              {
                first_member_id: format(sender_format),
                second_member_id: format(target_format)
              },
              {
                first_member_id: format(target_format),
                second_member_id: format(sender_format)
              }
            ]
          }
        });
        if (!find)
          return reply.status(404).send({ message: "not found" });
        socket.emit("sendMessage", {
          room: find?.id,
          number: sender_format,
          name: body.data.pushName,
          message: body.data.message.conversation
        });
        return reply.status(201).send({ message: "sender" });
      }
      ;
      if (body.event === "messages.upsert" && body.data.messageType === "conversation") {
        const find = await prisma2.chat.findFirst({
          where: {
            OR: [
              {
                first_member_id: format(sender_format),
                second_member_id: format(target_format)
              },
              {
                first_member_id: format(target_format),
                second_member_id: format(sender_format)
              }
            ]
          }
        });
        if (!find)
          return reply.status(404).send({ message: "not found" });
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
    return import_express.response.status(201).json({ message: 201 });
  }
};

// src/modules/instance.ts
var import_client3 = require("@prisma/client");
var prisma3 = new import_client3.PrismaClient();
var InstanceControllers = class {
  async find(request, reply) {
    const { use_logged_id } = request.query;
    return prisma3.instance.findMany({
      where: {
        user_id: `${use_logged_id}`
      },
      include: {
        Chat: {
          include: {
            second_member: true
          }
        }
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async create(request, reply) {
    const { use_logged_id } = request.query;
    const { instance_name } = request.body;
    return await prisma3.instance.create({
      data: {
        instance_name,
        user_id: `${use_logged_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatControllers,
  InstanceControllers,
  UserControllers
});
