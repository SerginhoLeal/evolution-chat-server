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

// src/modules/message.ts
var message_exports = {};
__export(message_exports, {
  MessagesControllers: () => MessagesControllers
});
module.exports = __toCommonJS(message_exports);
var import_socket = require("socket.io-client");

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

// src/modules/message.ts
var socket = (0, import_socket.io)(`${process.env.PRODUCTION_BASE_URL}`, { transports: ["websocket"] });
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
      message: `${message}`
    };
    const result = await prisma.message.create({ data });
    socket.emit("send_message", data);
    return reply.status(201).json(result);
  }
  async messages_media(request, reply) {
    const user_id = request.id;
    const element = request.file;
    const { room_id } = request.query;
    const { message } = request.body;
    const user = await prisma.user.findFirst({
      where: {
        id: `${user_id}`
      }
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
    socket.emit("send_message", data);
    return reply.status(201).json(result);
  }
  // set the url to evolution
  // if (request.body.event === 'connection.update' && request.body.data.state === 'open') {
  //   console.log(JSON.stringify(request.body, null, 5));
  // }
  async message_by_whatsapp(request, reply) {
    const body = request.body;
    console.log("entrou");
    console.log(body);
    if (body.data.messageType === "conversation" && body.data.message.conversation) {
      console.log("entrou");
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
      console.log(result);
      socket.emit("send_message", data);
      return reply.status(201).json(result);
    }
    return reply.status(404).json({ message: "not found" });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessagesControllers
});
