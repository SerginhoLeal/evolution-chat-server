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

// src/routes.ts
var routes_exports = {};
__export(routes_exports, {
  routes: () => routes
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

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
  async delete(request, reply) {
    const { use_logged_id } = request.query;
    return await prisma.user.delete({
      where: {
        id: `${use_logged_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
};

// src/modules/chat/index.ts
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
    const { use_logged_id, target_id, instance_id } = request.body;
    return prisma2.chat.create({
      data: {
        first_member_id: `${use_logged_id}`,
        second_member_id: `${target_id}`,
        instance_id: `${instance_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(400).end({ error }));
  }
  async send(request, reply) {
    const body = request.body;
    if (body.event === "connection.update" && body.data.state === "open") {
      socket.emit("instance_connected", {
        instance: body.instance,
        message: "Instance Connected",
        status: true
      });
    }
    ;
    console.log(body);
    if (body.event === "messages.upsert" && body.data.messageType === "extendedTextMessage") {
      const verify_data = body.data?.remoteJid ? body.data?.remoteJid : body.data.key.remoteJid;
      const findUser = await prisma2.user.findMany({
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
      if (findUser.length !== 2)
        return reply.status(404).send({ message: "Number Not Found" });
      const find = await prisma2.chat.findFirst({
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
        number: verify_data.replace("@s.whatsapp.net", ""),
        name: body.data.pushName,
        message: body.data.message.extendedTextMessage.text
      });
      return reply.status(201).send({ message: "sender" });
    }
    ;
    if (body.event === "messages.upsert" && body.data.messageType === "conversation") {
      const verify_data = body.data?.remoteJid ? body.data?.remoteJid : body.data.key.remoteJid;
      const findUser = await prisma2.user.findMany({
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
      if (findUser.length !== 2)
        return reply.status(404).send({ message: "Number Not Found" });
      const find = await prisma2.chat.findFirst({
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
        number: verify_data.replace("@s.whatsapp.net", ""),
        name: body.data.pushName,
        message: body.data.message.conversation
      });
      return reply.status(201).send({ message: "sender" });
    }
    ;
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
        chat: {
          include: {
            second_member: true
          }
        }
      }
    }).then((success) => {
      if (success.length === 0) {
        return reply.status(201).json({ data: success, status: "empty", message: "Create an Instance" });
      }
      ;
      return reply.status(201).json({ data: success, status: "data", message: `Returned ${success.length} instances` });
    }).catch((error) => reply.status(404).end({ error }));
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
  async delete(request, reply) {
    const { use_logged_id, instance_id } = request.query;
    return await prisma3.instance.delete({
      where: {
        id: `${instance_id}`,
        user_id: `${use_logged_id}`
      }
    }).then((success) => reply.status(201).json({ message: `instance ${success.instance_name} deleted` })).catch((error) => reply.status(404).end({ error }));
  }
};

// src/routes.ts
var routes = (0, import_express.Router)();
var userControllers = new UserControllers();
var chatControllers = new ChatControllers();
var instanceControllers = new InstanceControllers();
routes.post("/login-user", userControllers.login);
routes.post("/create-user", userControllers.register);
routes.delete("/delete-user", userControllers.delete);
routes.get("/find-instance", instanceControllers.find);
routes.post("/create-instance", instanceControllers.create);
routes.delete("/delete-instance", instanceControllers.delete);
routes.get("/find-chat", chatControllers.find);
routes.post("/create-chat", chatControllers.create);
routes.post("/send-by-whatsapp", chatControllers.send);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routes
});
