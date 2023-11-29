"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
    const { use_logged_id, contact_id } = request.query;
    if (!use_logged_id && !contact_id) {
      return reply.status(400).end({ error: "Params empty" });
    }
    return await prisma2.chat.findFirst({
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
    return prisma2.chat.create({
      data: {
        user_id: `${use_logged_id}`,
        contact_id: `${contact_id}`,
        instance_id: `${instance_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(400).end({ error }));
  }
  async send(request, reply) {
    const body = request.body;
    console.log(body);
    if (body.event === "connection.update" && body.data.state === "open") {
      console.log("connection.update && open: ", body, 5);
      socket.emit("instance_connected", {
        instance: body.instance,
        message: "Instance Connected",
        status: true
      });
    }
    ;
    if (body.event === "messages.upsert" && body.data.messageType === "extendedTextMessage") {
      console.log("messages.upsert && extendedTextMessage: ", body, 5);
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
              user_id: findUser[0].id,
              contact_id: findUser[1].id
            },
            {
              user_id: findUser[1].id,
              contact_id: findUser[0].id
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
      console.log("messages.upsert && conversation: ", body, 5);
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
              user_id: findUser[0].id,
              contact_id: findUser[1].id
            },
            {
              user_id: findUser[1].id,
              contact_id: findUser[0].id
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

// src/services/index.ts
var import_axios = __toESM(require("axios"));
var evolution_api = import_axios.default.create({
  baseURL: `${process.env.EVOLUTION_API}`,
  headers: {
    "Content-Type": "application/json",
    apikey: `${process.env.API_KEY}`
  }
});

// src/modules/instance.ts
var prisma3 = new import_client3.PrismaClient();
var InstanceControllers = class {
  async find(request, reply) {
    const { use_logged_id } = request.query;
    const instance = await prisma3.instance.findFirst({
      where: {
        user_id: `${use_logged_id}`
      },
      include: {
        chat: {
          include: {
            contact: true
          }
        }
      }
    });
    return reply.status(201).json({ instance });
  }
  async create(request, reply) {
    const { use_logged_id } = request.query;
    const { instance_name } = request.body;
    const find_user = await prisma3.user.findFirst({
      where: {
        id: `${use_logged_id}`
      }
    });
    const creating_instance = await evolution_api.post("/instance/create", {
      instanceName: `${instance_name}`,
      qrcode: true,
      number: `${find_user?.number}`
    });
    if (creating_instance.status !== 201)
      return reply.status(404).end({ message: "Fail to Create Instance" });
    evolution_api.post(`/webhook/set/${creating_instance.data.instance.instanceName}`, {
      url: `${process.env.PRODUCTION_BASE_URL}/api/send-by-whatsapp`,
      webhook_by_events: false,
      webhook_base64: false,
      events: [
        "QRCODE_UPDATED",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONNECTION_UPDATE",
        "CALL"
      ]
    });
    return prisma3.instance.create({
      data: {
        instance_name: creating_instance.data.instance.instanceName,
        user_id: `${use_logged_id}`
      }
    }).then((data) => reply.status(201).json(creating_instance.data)).catch((error) => reply.status(404).end({ error }));
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

// src/modules/contact.ts
var import_client4 = require("@prisma/client");
var prisma4 = new import_client4.PrismaClient();
var ContactControllers = class {
  async register(request, reply) {
    const { name, number } = request.body;
    return await prisma4.contact.create({
      data: {
        name: `${name}`,
        number: `${number}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async delete(request, reply) {
    const { use_logged_id } = request.query;
    return await prisma4.contact.delete({
      where: {
        id: `${use_logged_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
};

// src/routes.ts
var routes = (0, import_express.Router)();
var userControllers = new UserControllers();
var chatControllers = new ChatControllers();
var instanceControllers = new InstanceControllers();
var contactControllers = new ContactControllers();
routes.post("/login-user", userControllers.login);
routes.post("/create-user", userControllers.register);
routes.delete("/delete-user", userControllers.delete);
routes.post("/create-contact", contactControllers.register);
routes.delete("/delete-contact", contactControllers.delete);
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
