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
    return reply.status(404).json({ message: "not found" });
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
            photo: true
          }
        },
        user: {
          select: {
            id: true,
            nickname: true,
            photo: true
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
    const { target_id } = request.body;
    return prisma.friend.create({
      data: {
        user_id: `${user_id}`,
        target_id: `${target_id}`
      }
    }).then((data) => reply.status(201).json(data)).catch((error) => reply.status(400).json(error));
  }
};

// src/utils/multer.ts
var import_multer = __toESM(require("multer"));
var import_path = __toESM(require("path"));
var import_node_crypto = __toESM(require("crypto"));
var storageTypes = {
  local: import_multer.default.diskStorage({
    destination: (req, file, cb) => {
      cb(null, import_path.default.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      import_node_crypto.default.randomBytes(16, (err, hash) => {
        if (err)
          cb(err);
        file.key = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, file.key);
      });
    }
  }),
  cloud: import_multer.default.diskStorage({
    filename: (req, file, cb) => {
      import_node_crypto.default.randomBytes(16, (err, hash) => {
        if (err)
          cb(err);
        file.key = `${hash.toString("hex")}`;
        file.mimetype = file.mimetype.slice(0, 5);
        cb(null, file.key);
      });
    }
  })
};
var multer_default = (0, import_multer.default)({
  // dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes["cloud"],
  limits: {
    fileSize: 1e3 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      "image/jpg",
      "image/webp",
      "video/mp4",
      "video/webm"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
});

// src/middleware/index.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var PRIVATE = "2615948";
var middleware_default = (request, reply, next) => {
  const authorization = request.headers.authorization;
  if (!authorization || !authorization.includes("Bearer")) {
    return reply.status(401).send("no_token_provided");
  }
  const [, token] = authorization.split(" ");
  try {
    const payload = import_jsonwebtoken2.default.verify(token, PRIVATE);
    request.id = payload.id;
    return next();
  } catch (e) {
    return reply.status(401).send("token_invalid");
  }
};

// src/routes.ts
var routes = (0, import_express.Router)();
var userControllers = new UserControllers();
var friendControllers = new FriendControllers();
var messagesControllers = new MessagesControllers();
var storage = multer_default.single("file");
routes.post("/login-user", userControllers.login);
routes.post("/create-user", userControllers.register);
routes.use(middleware_default);
routes.delete("/delete-user", userControllers.delete);
routes.get("/friends", friendControllers.friends);
routes.get("/friend", friendControllers.friend);
routes.post("/create", friendControllers.create);
routes.get("/messages-whatsapp", messagesControllers.index);
routes.post("/message-whatsapp", messagesControllers.messages);
routes.post("/message-media-whatsapp", storage, messagesControllers.messages_media);
routes.post("/message-by-whatsapp", messagesControllers.message_by_whatsapp);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routes
});
