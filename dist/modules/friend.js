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

// src/modules/friend.ts
var friend_exports = {};
__export(friend_exports, {
  FriendControllers: () => FriendControllers
});
module.exports = __toCommonJS(friend_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FriendControllers
});
