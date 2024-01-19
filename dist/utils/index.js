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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/index.ts
var utils_exports = {};
module.exports = __toCommonJS(utils_exports);

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
