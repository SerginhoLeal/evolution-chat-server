"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// server.ts
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_socket = require("socket.io");
var import_socket2 = require("socket.io-client");
var import_client = require("@prisma/client");
var app = (0, import_express.default)();
var prisma = new import_client.PrismaClient();
var socket = (0, import_socket2.io)("http://localhost:3000", { transports: ["websocket"] });
app.use(import_express.default.json({ limit: "1gb" }));
app.use((0, import_cors.default)());
var users = [];
app.post("/api/login-user", async (request, reply) => {
  const { name, number } = request.body;
  return prisma.user.findFirst({
    where: {
      name: `${name}`,
      number: `${number}`
    }
  }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
});
app.post("/api/register-user", async (request, reply) => {
  const { name, number } = request.body;
  return await prisma.user.create({
    data: {
      name: `${name}`,
      number: `${number}`
    }
  }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
});
app.get("/api/get-chat", async (request, reply) => {
  const { user_id, target_id } = request.query;
  return await prisma.chat.findFirst({
    where: {
      OR: [
        {
          first_member_id: `${target_id}`,
          second_member_id: `${user_id}`
        },
        {
          first_member_id: `${user_id}`,
          second_member_id: `${target_id}`
        }
      ]
    }
  }).then((success) => {
    const adding_message = {
      ...success,
      chat_messages: [
        {
          number: "553197556413",
          name: "sergio leal",
          message: "Me contrata ai \u{1F44D}"
        }
      ]
    };
    return reply.status(201).json(adding_message);
  }).catch((error) => reply.status(404).end({ error }));
});
app.post("/api/create-chat", async (request, reply) => {
  const { user_id, target_id } = request.query;
  return await prisma.chat.create({
    data: {
      first_member_id: `${user_id}`,
      second_member_id: `${target_id}`,
      number: "0"
    }
  }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
});
app.post("/api/send-message", async (request, reply) => {
  const { message } = request.body;
  socket.emit("sendServerMessage", {
    room: "clpb8h07i0000di39ikvbupkw",
    userId: "a80aa75f-69c0-48cd-b48c-ded62f12a3f5",
    message: "Me contrata ai \u{1F44D}"
  });
  return reply.status(201).send({ message: "success" });
});
app.post("/api/webhook", async (request, reply) => {
  const body = request.body;
  console.log(body);
  return reply.status(201).send({ message: "success" });
});
var express_server = app.listen({ port: 3e3 });
var io = new import_socket.Server(express_server, {
  cors: {
    origin: "*"
  }
});
io.on("connection", (socket2) => {
  socket2.on("add_new_user", ({ id, name, number }) => {
    !users.some((user) => user.id === id) && users.push({
      id,
      name,
      number,
      socketId: socket2.id
    });
    io.emit("get_online_users", users);
  });
  socket2.on("on_join_room", ({ room, userId }) => {
    socket2.join(room);
  });
  socket2.on("sendMessage", (data) => {
    const user = users.find((u) => u.id === data.userId);
    io.to(data.room).emit("message", {
      number: user.number,
      name: user.name,
      message: data.message
    });
  });
  socket2.on("sendServerMessage", (data) => {
    const user = users.find((u) => u.id === data.userId);
    io.to(data.room).emit("message", {
      number: user.number,
      name: user.name,
      message: data.message
    });
  });
  socket2.on("disconnect", () => {
    users = users.filter((users2) => users2.socketId !== socket2.id);
    io.emit("get_online_users", users);
  });
});
