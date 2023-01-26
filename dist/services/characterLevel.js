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
exports.updateUserCharacter = exports.updateUserExp = exports.addExpData = void 0;
const expModel = __importStar(require("../models/expModel"));
const userModel = __importStar(require("../models/userModel"));
const moment_1 = __importDefault(require("moment"));
// 유저 경험치 업데이트 관련 로그
function addExpData(userId, score, category, likeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const expData = {
            userId,
            category,
            score,
            likeId,
            time: (0, moment_1.default)().format("YYYY-MM-DD HH:mm"),
        };
        yield expModel.addExpData(expData);
    });
}
exports.addExpData = addExpData;
// 유저 경험치 업데이트
function updateUserExp(userId, score) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel.findByUserId(userId);
        const currentExp = parseInt(user.userExp);
        const nowExp = currentExp + score;
        let updateExp = 0;
        let updateLevel = 0;
        let updateLevelResult = false;
        console.log(score);
        console.log(nowExp);
        if (nowExp >= 100) {
            // 레벨
            updateLevel = nowExp / 100;
            updateLevel = user.userLevel + updateLevel;
            // 경험치
            updateExp = nowExp % 100;
            updateLevelResult = yield userModel.updateLevel(userId, updateLevel);
        }
        else {
            updateExp = nowExp;
        }
        console.log(updateExp);
        // 경험치 업데이트
        const updateExpResult = yield userModel.updateExp(userId, updateExp);
        if (updateLevelResult && updateExpResult) {
            return "all";
        }
        else if (updateLevelResult === false && updateExpResult === true) {
            return "exp";
        }
        else {
            return "error";
        }
    });
}
exports.updateUserExp = updateUserExp;
function updateUserCharacter(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel.findByUserId(userId);
        let data;
        if (user.userLevel >= 1 && user.userLevel <= 10) {
            if (user.ch_idx !== 1) {
                data = yield userModel.updateCharacter(userId, 1);
            }
        }
        if (user.userLevel >= 11 && user.userLevel <= 20) {
            if (user.ch_idx !== 2) {
                data = yield userModel.updateCharacter(userId, 2);
            }
        }
        if (user.userLevel >= 21 && user.userLevel <= 30) {
            if (user.ch_idx !== 3) {
                data = yield userModel.updateCharacter(userId, 3);
            }
        }
        if (user.userLevel >= 31 && user.userLevel <= 40) {
            if (user.ch_idx !== 4) {
                data = yield userModel.updateCharacter(userId, 4);
            }
        }
        if (user.userLevel >= 41) {
            if (user.ch_idx !== 5) {
                data = yield userModel.updateCharacter(userId, 5);
            }
        }
    });
}
exports.updateUserCharacter = updateUserCharacter;
