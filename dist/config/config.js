"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`key ${key} is undefined`);
    }
    console.log(value);
    return value;
}
exports.config = {
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: required("JWT_EXPIRES_SEC"),
    },
    bcrypt: {
        saltRounds: required("BCRYPT_SALT_ROUNDS"),
    },
    db: {
        host: required("DB_HOST"),
        user: required("DB_USER"),
        database: required("DB_DATABASE"),
        password: required("DB_PASSWORD"),
        port: required("DB_PORT"),
    },
    mdb: {
        host: required("MDB_HOST"),
    },
    kakao: {
        key: required("KAKAO_RESTAPI"),
        redirectUrl: required("KAKAO_REDIRECTURL")
    },
    naver: {
        id: required("EMAIL_ID"),
        password: required("EMAIL_PASSWORD"),
    }
};
