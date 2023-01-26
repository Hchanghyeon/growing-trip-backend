"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthCheck = exports.isAuth = exports.createRefreshToken = exports.createJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_js_1 = require("../config/config.js");
const userModel = __importStar(require("../models/userModel.js"));
const { secretKey, expiresInSec } = config_js_1.config.jwt;
const AUTH_ERROR = { message: "Authentication Error" };
// jwt accessToken 생성
function createJwtToken(id) {
    return jsonwebtoken_1.default.sign({ id }, secretKey, { expiresIn: expiresInSec });
}
exports.createJwtToken = createJwtToken;
// jwt refreshToken 생성
function createRefreshToken() {
    return jsonwebtoken_1.default.sign({}, secretKey, { expiresIn: "14d" });
}
exports.createRefreshToken = createRefreshToken;
// 쿠키 인증기반
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, accessToken } = req.body;
    if (!accessToken) {
        return res.status(401).json(AUTH_ERROR);
    }
    else {
        jsonwebtoken_1.default.verify(accessToken, secretKey, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res.status(401).json(AUTH_ERROR);
            }
            const user = yield userModel.findByUserId(decoded.id);
            if (!user) {
                return res.status(401).json(AUTH_ERROR);
            }
            next();
        }));
    }
});
exports.isAuth = isAuth;
// 쿠키 인증기반(인증은 하나 해당 페이지에서 로그인이 안되어있어도 되는 경우)
const isAuthCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let authHeader = req.headers.authorization;
    let accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken) {
        next();
    }
    else {
        jsonwebtoken_1.default.verify(accessToken, secretKey, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res.status(401).json(AUTH_ERROR);
            }
            const user = yield userModel.findByUserId(decoded.id);
            if (!user) {
                return res.status(401).json(AUTH_ERROR);
            }
            req.body.authId = user.userId; // req.customData
            next();
        }));
    }
});
exports.isAuthCheck = isAuthCheck;
