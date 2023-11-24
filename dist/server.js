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
var TEST_URL = "http://localhost:3000";
var socket = (0, import_socket2.io)(TEST_URL, { transports: ["websocket"] });
app.use(import_express.default.json({ limit: "1gb" }));
app.use((0, import_cors.default)());
var users = [];
var chats = [
  {
    // me && laura
    room_id: "clpclotx80001edbnuk9yzz9n",
    destination: "db",
    first_member_id: "05abe21d-3049-43f8-a842-5fb2af40d8f1",
    second_member_id: "badd34de-ae07-4c0a-9c68-aaf17f94f32d",
    chat_messages: [
      {
        number: "553175564133",
        name: "serginho",
        message: "bom dia, amor \u2764",
        send_at: "2023-11-22 17:26:06"
      }
    ]
  },
  {
    // me && laura
    room_id: "clpcngx0h00018b4iw8bk1cgg",
    destination: "db",
    first_member_id: "05abe21d-3049-43f8-a842-5fb2af40d8f1",
    second_member_id: "ecb500ed-4128-4f46-851f-61c0ed43f4f9",
    chat_messages: [
      {
        number: "553172363441",
        name: "luiz",
        message: "salve seu gay",
        send_at: "2023-11-22 17:26:06"
      }
    ]
  }
];
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

  if (!user_id && !target_id) {
    return reply.status(400).end({ error: "Params empty" });
  }
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
    const find = chats.find((chat) => chat.room_id === success.id);
    return reply.status(201).json(find);
  }).catch((error) => {
    return reply.status(404).end({ error })
  });
});
app.post("/api/create-instance", async (request, reply) => {
  const { user_id, target_id } = request.query;
  return await prisma.instance.create({
    data: {
      instance_name: "whatsapp_instance_sergio"
    }
  }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
});
app.post("/api/create-chat", async (request, reply) => {
  const { user_id, target_id, instance_id } = request.query;
  return await prisma.chat.create({
    data: {
      first_member_id: `${user_id}`,
      second_member_id: `${target_id}`,
      instance_id: `${instance_id}`
    }
  }).then((success) => reply.status(201).json(success)).catch((error) => reply.status(404).end({ error }));
});
app.post("/api/send-message", async (request, reply) => {
  const { room, userId } = request.query;
  const { message } = request.body;
  socket.emit("sendServerMessage", { room, userId, message });
  const data = {
    room,
    userId,
    message
  };
  return reply.status(201).send(data);
});
app.post("/api/webhook", async (request, reply) => {
  const body = request.body;
  console.log(JSON.stringify(body, null, 5));
  return reply.status(201).send({ body });
});
var express_server = app.listen({ port: process.env.PORT || 3e3 });
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
    io.to(data.room).emit("message", {
      number: data.number,
      name: data.name,
      message: data.message
    });
  });
  socket2.on("sendServerMessage", (data) => {
    io.to(data.room).emit("message", {
      number: data.number,
      name: data.name,
      message: data.message
    });
  });
  socket2.on("disconnect", () => {
    users = users.filter((users2) => users2.socketId !== socket2.id);
    io.emit("get_online_users", users);
  });
});
