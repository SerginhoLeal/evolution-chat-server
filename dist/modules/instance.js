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

// src/modules/instance.ts
var instance_exports = {};
__export(instance_exports, {
  InstanceControllers: () => InstanceControllers
});
module.exports = __toCommonJS(instance_exports);
var import_client = require("@prisma/client");

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
var prisma = new import_client.PrismaClient();
var InstanceControllers = class {
  async find(request, reply) {
    const { use_logged_id } = request.query;
    const instance = await prisma.instance.findFirst({
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
    const find_user = await prisma.user.findFirst({
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
    return prisma.instance.create({
      data: {
        instance_name: creating_instance.data.instance.instanceName,
        user_id: `${use_logged_id}`
      }
    }).then((data) => reply.status(201).json(creating_instance.data)).catch((error) => reply.status(404).end({ error }));
  }
  async delete(request, reply) {
    const { use_logged_id, instance_id } = request.query;
    return await prisma.instance.delete({
      where: {
        id: `${instance_id}`,
        user_id: `${use_logged_id}`
      }
    }).then((success) => reply.status(201).json({ message: `instance ${success.instance_name} deleted` })).catch((error) => reply.status(404).end({ error }));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InstanceControllers
});
