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

// src/modules/contact.ts
var contact_exports = {};
__export(contact_exports, {
  ContactControllers: () => ContactControllers
});
module.exports = __toCommonJS(contact_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var ContactControllers = class {
  async register(request, reply) {
    const { name, number } = request.body;
    return await prisma.contact.create({
      data: {
        name: `${name}`,
        number: `${number}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
  async delete(request, reply) {
    const { use_logged_id } = request.query;
    return await prisma.contact.delete({
      where: {
        id: `${use_logged_id}`
      }
    }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ContactControllers
});
