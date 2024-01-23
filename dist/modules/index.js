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

// src/modules/index.ts
var modules_exports = {};
__export(modules_exports, {
  FriendControllers: () => FriendControllers,
  InstanceControllers: () => InstanceControllers,
  MessagesControllers: () => MessagesControllers,
  UserControllers: () => UserControllers
});
module.exports = __toCommonJS(modules_exports);

// src/modules/user.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/services/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/services/cloudinary.ts
var import_cloudinary = __toESM(require("cloudinary"));
import_cloudinary.default.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// src/services/axios.ts
var import_axios = __toESM(require("axios"));
var evolution_api = import_axios.default.create({
  baseURL: `${process.env.EVOLUTION_API}`,
  headers: {
    "Content-Type": "application/json",
    apikey: `${process.env.EVOLUTION_KEY}`
  }
});

// src/modules/user.ts
var UserControllers = class {
  async login(request, reply) {
    const { nickname, password } = request.body;
    const data = await prisma.user.findFirst({
      where: {
        nickname: `${nickname}`,
        password: `${password}`
      }
    });
    if (!data) {
      return reply.status(404).json({ message: "User does not exist" });
    }
    ;
    const token = import_jsonwebtoken.default.sign(data, "2615948");
    return reply.cookie("evoToken", token, { maxAge: 86400 }).status(201).json({ data, token });
  }
  async register(request, reply) {
    const { name, nickname, email, password, number, photo } = request.body;
    return prisma.user.create({
      data: {
        name: `${name}`,
        nickname: `${nickname}`,
        password: `${password}`,
        email: `${email}`,
        number: `${number}`,
        photo: `${photo}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async put(request, reply) {
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

// src/modules/message.ts
var import_socket = require("socket.io-client");
var socket = (0, import_socket.io)(`${process.env.BASE_URL}`, { transports: ["websocket"] });
var MessagesControllers = class {
  async index(request, reply) {
    const { room_id } = request.query;
    const data = await prisma.message.findMany({
      where: {
        room_id: `${room_id}`
      }
    });
    return reply.status(201).json(data);
  }
  async messages(request, reply) {
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
      message_type: "text",
      file: null,
      width: null,
      height: null,
      message: `${message}`
    };
    const result = await prisma.message.create({ data });
    socket.emit("send_message", data);
    socket.emit("evolution-notification-request", {
      room_id,
      isRead: false,
      data: /* @__PURE__ */ new Date()
    });
    return reply.status(201).json(result);
  }
  async messages_media(request, reply) {
    const user_id = request.id;
    const { room_id } = request.query;
    const { message, width, height } = request.body;
    const element = request.file;
    const randomId = `${Math.random()} size_image`;
    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
    });
    socket.emit("send_preview_image_or_video", {
      randomId,
      room_id,
      name: `${user?.nickname}`,
      number: `${user?.number}`,
      message_type: "preloading",
      width,
      height
    });
    const upload = await import_cloudinary.default.v2.uploader.upload(element.path, {
      resource_type: `${element.mimetype}`,
      public_id: `evo/${element.filename}`,
      overwrite: true
    });
    const data = {
      room_id: `${room_id}`,
      name: `${user?.nickname}`,
      number: `${user?.number}`,
      message_type: `${element.mimetype}`,
      file: upload.url,
      width: `${upload.width}`,
      height: `${upload.height}`,
      message: `${message}`
    };
    const result = await prisma.message.create({ data });
    socket.emit("send_message", {
      ...data,
      randomId
    });
    return reply.status(201).json(result);
  }
  // console.log(JSON.stringify(request.body, null, 5));
  async message_by_whatsapp(request, reply) {
    const body = request.body;
    if (body.event === "connection.update" && body.data.state === "open") {
      console.log(JSON.stringify(request.body, null, 5));
    }
    if (body.data.messageType === "conversation" && body.data.message.conversation) {
      const contact = body.data.key.remoteJid.replace("@s.whatsapp.net", "");
      const data = {
        room_id: `${body.instance}`,
        name: `${body.data.pushName}`,
        number: `${contact}`,
        message_type: "text",
        file: null,
        message: `${body.data.message.conversation}`
      };
      const result = await prisma.message.create({ data });
      socket.emit("send_message", data);
      return reply.status(201).json(result);
    }
    return reply.status(201).json(request.body);
  }
  async media_file(request, reply) {
    const user_id = request.id;
    const { room_id } = request.query;
    const result = await prisma.message.findMany({
      where: {
        OR: [
          {
            room_id: `${room_id}`,
            message_type: "image"
          },
          {
            room_id: `${room_id}`,
            message_type: "video"
          }
        ]
      }
    });
    return reply.status(201).json(result);
  }
};

// src/modules/friend.ts
var FriendControllers = class {
  async friends(request, reply) {
    const user_id = request.id;
    const friend = await prisma.friend.findMany({
      where: {
        OR: [
          { user_id: `${user_id}` },
          { target_id: `${user_id}` }
        ]
      },
      include: {
        target: {
          select: {
            id: true,
            nickname: true,
            photo: true,
            number: true
          }
        },
        user: {
          select: {
            id: true,
            nickname: true,
            photo: true,
            number: true
          }
        },
        messages: {
          take: -1,
          select: {
            message: true,
            message_type: true,
            created_at: true
          }
        }
      }
    });
    return reply.status(201).json(friend);
  }
  async friend(request, reply) {
    const user_id = request.id;
    const { target_id } = request.query;
    return prisma.friend.findFirst({
      where: {
        OR: [
          {
            user_id: `${user_id}`,
            target_id: `${target_id}`
          },
          {
            user_id: `${target_id}`,
            target_id: `${user_id}`
          }
        ]
      }
    }).then((data) => reply.status(201).json(data)).catch((error) => reply.status(400).json(error));
  }
  async create(request, reply) {
    const user_id = request.id;
    const { target_id, type_chat } = request.body;
    return prisma.friend.create({
      data: {
        user_id: `${user_id}`,
        target_id: `${target_id}`,
        type_chat: `${type_chat}`
      }
    }).then((data) => reply.status(201).json(data)).catch((error) => reply.status(400).json(error));
  }
};

// src/modules/instance.ts
var import_socket2 = require("socket.io-client");
var socket2 = (0, import_socket2.io)(`${process.env.BASE_URL}`, { transports: ["websocket"] });
var InstanceControllers = class {
  async connect(request, reply) {
    const { instance } = request.query;
    const { data } = await evolution_api.get(`/instance/connect/${instance}`);
    return reply.status(201).json(data);
  }
  async webhook(request, reply) {
    const body = request.body;
    if (body.event === "connection.update" && body.data.state === "open") {
      socket2.emit("evolution-api-connect", {
        message: `instance ${body.instance} connected`,
        status: "success",
        instance_name: body.instance
      });
    }
    if (body.data.messageType === "conversation" && body.data.message.conversation) {
      const contact = body.data.key.remoteJid.replace("@s.whatsapp.net", "");
      const me = body.sender.replace("@s.whatsapp.net", "");
      const data = await prisma.user.findMany({
        where: {
          OR: [
            { number: `${contact.slice(0, 4)}9${contact.slice(4, 12)}` },
            { number: `${me.slice(0, 4)}9${me.slice(4, 12)}` }
          ]
        }
      });
      if (data.length !== 2)
        return "error";
      const room = await prisma.friend.findFirst({
        where: {
          OR: [
            {
              user_id: `${data[0].id}`,
              target_id: `${data[1].id}`
            },
            {
              user_id: `${data[1].id}`,
              target_id: `${data[0].id}`
            }
          ]
        }
      });
      const constructor = {
        room_id: `${room?.id}`,
        name: `${body.data.pushName}`,
        number: `${contact}`,
        message_type: "text",
        file: null,
        message: `${body.data.message.conversation}`
      };
      const result = await prisma.message.create({ data: constructor });
      socket2.emit("send_message", result);
      return reply.status(201).json(result);
    }
    if (body.data.messageType === "extendedTextMessage" && body.data.message.extendedTextMessage.text) {
      const contact = body.data.key.remoteJid.replace("@s.whatsapp.net", "");
      const me = body.sender.replace("@s.whatsapp.net", "");
      const data = await prisma.user.findMany({
        where: {
          OR: [
            { number: `${contact.slice(0, 4)}9${contact.slice(4, 12)}` },
            { number: `${me.slice(0, 4)}9${me.slice(4, 12)}` }
          ]
        }
      });
      if (data.length !== 2)
        return "error";
      const room = await prisma.friend.findFirst({
        where: {
          OR: [
            {
              user_id: `${data[0].id}`,
              target_id: `${data[1].id}`
            },
            {
              user_id: `${data[1].id}`,
              target_id: `${data[0].id}`
            }
          ]
        }
      });
      const constructor = {
        room_id: `${room?.id}`,
        name: `${body.data.pushName}`,
        number: `${contact}`,
        message_type: "text",
        file: null,
        message: `${body.data.message.extendedTextMessage.text}`
      };
      const result = await prisma.message.create({ data: constructor });
      socket2.emit("send_message", result);
      return reply.status(201).json(result);
    }
    return reply.status(401).json({ message: "no" });
  }
  async send_message(request, reply) {
    const user_id = request.id;
    const { room_id, instance, number } = request.query;
    const { message } = request.body;
    const contact = `${number.slice(0, 4)}${number.slice(5, 13)}`;
    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
    });
    const data = {
      room_id: `${room_id}`,
      name: `platform_${user?.nickname}`,
      number: `${user?.number}`,
      message_type: "text",
      file: null,
      width: null,
      height: null,
      message: `${message}`
    };
    const result = await prisma.message.create({ data });
    evolution_api.post(`/message/sendText/${instance}`, {
      number: contact,
      options: {
        delay: 1500,
        presence: "composing",
        linkPreview: false
      },
      textMessage: {
        text: `${message}`
      }
    });
    socket2.emit("send_message", result);
    return reply.status(201).json({ message: "success" });
  }
  async messages_media(request, reply) {
    const user_id = request.id;
    const { room_id } = request.query;
    const { message, width, height } = request.body;
    const element = request.file;
    const randomId = `${Math.random()} size_image`;
    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
    });
    socket2.emit("send_preview_image_or_video", {
      randomId,
      room_id,
      name: `${user?.nickname}`,
      number: `${user?.number}`,
      message_type: "preloading",
      width,
      height
    });
    const upload = await import_cloudinary.default.v2.uploader.upload(element.path, {
      resource_type: `${element.mimetype}`,
      public_id: `evo/${element.filename}`,
      overwrite: true
    });
    const data = {
      room_id: `${room_id}`,
      name: `${user?.nickname}`,
      number: `${user?.number}`,
      message_type: `${element.mimetype}`,
      file: upload.url,
      width: `${upload.width}`,
      height: `${upload.height}`,
      message: `${message}`
    };
    const result = await prisma.message.create({ data });
    socket2.emit("send_message", {
      ...data,
      randomId
    });
    return reply.status(201).json(result);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FriendControllers,
  InstanceControllers,
  MessagesControllers,
  UserControllers
});
