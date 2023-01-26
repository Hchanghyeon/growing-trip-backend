"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpTransport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const { id, password } = config_1.config.naver;
console.log(id, password);
exports.smtpTransport = nodemailer_1.default.createTransport({
    service: "Naver",
    host: 'smtp.naver.com',
    port: 587,
    auth: {
        user: id,
        pass: password,
    },
    tls: {
        rejectUnauthorized: false
    }
});
