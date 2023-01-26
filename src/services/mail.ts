import nodemailer from "nodemailer";
import { config } from "../config/config";

const {id, password} = config.naver;

console.log(id, password);

export const smtpTransport = nodemailer.createTransport({
    service: "Naver",
    host:'smtp.naver.com',
    port:587,
    auth: {
        user: id,
        pass: password,
    },
    tls: {
        rejectUnauthorized: false
    }
})
