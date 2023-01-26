"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCharacter = exports.updateLevel = exports.updateExp = exports.getUserList = exports.findByUserId = exports.userIdCheck = exports.addUserLevel = exports.createUser = exports.Character = exports.Users = void 0;
const mysql_js_1 = require("../db/mysql.js");
const sequelize_1 = require("sequelize");
// 유저모델
class Users extends sequelize_1.Model {
}
exports.Users = Users;
// 캐릭터 모델
class Character extends sequelize_1.Model {
}
exports.Character = Character;
// ** Associate 설정
Users.init({
    userId: {
        type: sequelize_1.DataTypes.STRING(50),
        primaryKey: true,
    },
    userPw: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    userName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    userMail: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    userBirth: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    userGender: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    userAddr1: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    userAddr2: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    regDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    imgSrc: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    userLevel: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    ch_idx: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    userExp: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, { modelName: "Users", tableName: "users", sequelize: mysql_js_1.sequelize, timestamps: false });
Character.init({
    ch_idx: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ch_image: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    ch_name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
}, {
    modelName: "Character",
    tableName: "character",
    sequelize: mysql_js_1.sequelize,
    timestamps: false,
});
Users.belongsTo(Character, { foreignKey: "ch_idx", targetKey: "ch_idx" });
// ** 유저 생성
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.create(user)
            .then((data) => {
            console.log(`SucessFully Create User ${user.userId}`);
            console.log(data);
            return true;
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    });
}
exports.createUser = createUser;
// ** 유저 레벨 추가하기
function addUserLevel(userId, level) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.increment({ userLevel: level }, { where: { userId: userId } })
            .then((data) => {
            console.log(" userLevel add Success ");
            return true;
        })
            .catch((err) => {
            console.error(err);
            return false;
        });
    });
}
exports.addUserLevel = addUserLevel;
// ** 유저 아이디 중복체크
function userIdCheck(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.findOne({ where: { userId } })
            .then((data) => {
            if (data) {
                console.log(`This user is in Database ${userId}`);
                return true;
            }
            else {
                console.log(`This user isn't in Database ${userId}`);
                return false;
            }
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    });
}
exports.userIdCheck = userIdCheck;
// ** 아이로 유저정보 가져오기
function findByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.findOne({
            where: { userId },
            include: [
                {
                    model: Character,
                },
            ],
        })
            .then((user) => {
            if (user) {
                console.log(`This user is in Database ${userId}`);
                return user;
            }
            else {
                console.log(`This user isn't in Database ${userId}`);
                return false;
            }
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    });
}
exports.findByUserId = findByUserId;
// ** 전체 유저리스트 가져오기
function getUserList() {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.findAll({
            include: [
                {
                    model: Character,
                },
            ],
        });
    });
}
exports.getUserList = getUserList;
// import { db } from "../db/mysql.js";
/* 유저 생성
export async function createUser(user) {
  return db
    .execute("insert into users (userId, userPw, userName, userMail, userAddr1, userAddr2, regDate) values (?,?,?,?,?,?,?,?)", user)
    .then((result) => console.log(`${result} 등록됨`));
}

// 모든 유저 가져오기
export async function getUser() {
  return db
    .execute("select * from users")
    .then((result) => {return result[0]});
}
*/
// ** 캐릭터 업데이트
function updateExp(userId, score) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.update({ userExp: score }, { where: { userId } })
            .then((data) => {
            console.log(data);
            return true;
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    });
}
exports.updateExp = updateExp;
// ** 캐릭터 업데이트
function updateLevel(userId, level) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.update({ userLevel: level }, { where: { userId } })
            .then((data) => {
            console.log(data);
            return true;
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    });
}
exports.updateLevel = updateLevel;
// ** 캐릭터 업데이트
function updateCharacter(userId, ch_idx) {
    return __awaiter(this, void 0, void 0, function* () {
        return Users.update({ ch_idx: ch_idx }, { where: { userId: userId } })
            .then((data) => {
            console.log(data);
            return true;
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    });
}
exports.updateCharacter = updateCharacter;
