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
var socket = (0, import_socket2.io)("https://evolution-chat.onrender.com", { transports: ["websocket"] });
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
  const slice_sender_one = body.sender.slice(0, 4);
  const slice_sender_two = body.sender.slice(4, 12);
  const slice_target_one = body.data.key.remoteJid.slice(0, 4);
  const slice_target_two = body.data.key.remoteJid.slice(4, 12);
  if (`${slice_sender_one}9${slice_sender_two}` === "553175564133" || `${slice_sender_one}9${slice_sender_two}` === "5531984106645") {
    if (body.event === "messages.upsert") {
      const format = (value) => {
        if (value === "5531975564133") {
          return "5fe9c787-4610-4132-998d-186f66f6129d";
        }
        ;
        if (value === "5531984106645") {
          return "02a82085-93ea-4e4e-8f39-a73cb2812f11";
        }
        ;
        return "";
      };
      const find = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              first_member_id: format(`${slice_sender_one}9${slice_sender_two}`),
              second_member_id: format(`${slice_target_one}9${slice_target_two}`)
            },
            {
              first_member_id: format(`${slice_target_one}9${slice_target_two}`),
              second_member_id: format(`${slice_sender_one}9${slice_sender_two}`)
            }
          ]
        }
      });
      socket.emit("sendServerMessage", {
        room: find.id,
        userId: format(`${slice_target_one}9${slice_target_two}`),
        message: body.data.message.conversation
      });
      return reply.status(201).send(find);
    }
  } else {
    return reply.status(201).send({ message: "Voc\xEA n\xE3o tem Permiss\xE3o para enviar mensagens aqui" });
  }
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
