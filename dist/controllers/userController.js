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
exports.getUserExpData = exports.AllUsers = exports.userInfo = exports.sendEmail = exports.userRegister = exports.userIdCheck = exports.userLogout = exports.userLogin = void 0;
const config_js_1 = require("../config/config.js");
const jwt_js_1 = require("../services/jwt.js");
const userModel = __importStar(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_1 = require("../services/mail");
const expModel = __importStar(require("../models/expModel"));
const { saltRounds } = config_js_1.config.bcrypt;
const cookieSetting = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
};
// 로그인 로직
function userLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, userPw } = req.body;
        const user = yield userModel.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: "Invalid user or password" });
        }
        const isValidPassword = yield bcrypt_1.default.compare(userPw, user.userPw);
        if (!isValidPassword) {
            return res.status(401).json({ message: " Invalid user or password" });
        }
        // 유저가 레벨업한 상태일때 ch_idx 변경
        let updateCharacter = false;
        if (user.userLevel >= 10) {
            updateCharacter = yield userModel.updateCharacter(userId, 2);
        }
        else if (user.userLevel >= 20) {
            updateCharacter = yield userModel.updateCharacter(userId, 3);
        }
        else if (user.userLevel >= 30) {
            updateCharacter = yield userModel.updateCharacter(userId, 4);
        }
        else if (user.userLevel >= 40) {
            updateCharacter = yield userModel.updateCharacter(userId, 5);
        }
        if (!updateCharacter) {
            console.log("캐릭터 업데이트 실패");
        }
        const accessToken = (0, jwt_js_1.createJwtToken)(user.userId);
        // httpOnly는 보안때문에 설정 / 쿠키 시간은 1시간
        res.cookie("accessToken", accessToken, cookieSetting);
        console.log(user);
        res.status(200).json({ accessToken, userId, imgSrc: user.imgSrc });
    });
}
exports.userLogin = userLogin;
// 로그아웃 로직
function userLogout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.clearCookie("accessToken");
        res.redirect("/");
    });
}
exports.userLogout = userLogout;
// 회원가입시 ID 중복 체크
function userIdCheck(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        const result = yield userModel.userIdCheck(userId);
        if (result) {
            return res.status(200).json({ result: true });
        }
        else {
            return res.status(200).json({ result: false });
        }
    });
}
exports.userIdCheck = userIdCheck;
// 회원가입 로직
function userRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        const userCheck = yield userModel.userIdCheck(user.userId);
        if (userCheck) {
            return res.status(409).json({ message: `${user.userId} already exists` });
        }
        const hased = yield bcrypt_1.default.hash(user.userPw, parseInt(saltRounds));
        user.regDate = new Date();
        user.userPw = hased;
        user.imgSrc = "/img/infoUserImg/user.png";
        user.userLevel = 1;
        user.ch_idx = 1;
        user.userExp = 0;
        const result = yield userModel.createUser(user);
        if (result) {
            return res.status(200).json({ result: true });
        }
        else {
            return res.status(200).json({ result: false });
        }
    });
}
exports.userRegister = userRegister;
function sendEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const number = generateRandom(111111, 999999);
        const mailOptions = {
            from: "changhyeonh@naver.com",
            to: email,
            subject: "[GrowT] 인증 메일 입니다",
            text: "오른쪽 숫자 6자리를 입력해주세요 : " + number,
        };
        const result = yield mail_1.smtpTransport.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ result: "error" });
            }
            else {
                return res.status(200).json({ result: number });
            }
        });
    });
}
exports.sendEmail = sendEmail;
function generateRandom(min, max) {
    const ranNum = Math.floor(Math.random() * (max - min + 1) + min);
    return ranNum;
}
function userInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        const data = yield userModel.findByUserId(userId);
        if (data) {
            return res.status(200).json({ data });
        }
        else {
            return res.status(401).json({});
        }
    });
}
exports.userInfo = userInfo;
function AllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield userModel.getUserList();
        if (data) {
            return res.status(200).json({ data });
        }
        else {
            return res.status(401).json({});
        }
    });
}
exports.AllUsers = AllUsers;
function getUserExpData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.authId;
        const result = yield expModel.getUserExpData(userId);
        if (result) {
            return res.status(200).json({ result });
        }
        else {
            return res.status(401).json({});
        }
    });
}
exports.getUserExpData = getUserExpData;
