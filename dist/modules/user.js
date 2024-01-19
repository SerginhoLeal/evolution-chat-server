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

// src/modules/user.ts
var user_exports = {};
__export(user_exports, {
  UserControllers: () => UserControllers
});
module.exports = __toCommonJS(user_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserControllers
});
