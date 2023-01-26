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
exports.getSearchNameAssay = exports.getUserAssayLike = exports.postAssay = exports.getAllAssay = exports.getUserAssay = void 0;
const assayModel = __importStar(require("../models/assayModel"));
const addressTranslate = __importStar(require("../services/addressTranslate"));
const moment_1 = __importDefault(require("moment"));
function getUserAssay(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        const data = yield assayModel.getUserAssay(userId);
        res.status(200).json({ data });
    });
}
exports.getUserAssay = getUserAssay;
function getAllAssay(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield assayModel.getAllAssay();
        res.status(200).json({ data });
    });
}
exports.getAllAssay = getAllAssay;
function postAssay(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, title, address, introduction } = req.body;
        const tag = JSON.parse(req.body.tag);
        const file = req.files.file;
        const time = new Date().getTime();
        let savePath = __dirname + "/../../src/public/img/assayUserImg/" + time + "_" + file.name;
        let addressXY;
        try {
            addressXY = yield addressTranslate.xyAddress(req.body.address);
        }
        catch (err) {
            return res.status(404).json({ result: "not Exist" });
        }
        if (addressXY.x === undefined || addressXY.y === undefined) {
            return res.status(404).json({ result: "not Exist" });
        }
        const assay = {
            userId,
            title,
            address,
            tag,
            introduction,
            latitude: addressXY.y,
            longitude: addressXY.x,
            imgpath: "/img/assayUserImg/" + time + "_" + file.name,
            formatTime: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
            likeNum: 0,
        };
        file.mv(savePath, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(500).json({ data: "error" });
            }
            else {
                yield assayModel.addAssay(assay);
                return res.status(200).json({ data: "success" });
            }
        }));
    });
}
exports.postAssay = postAssay;
function getUserAssayLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const userId = req.body.authId;
        const arr = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].contentsid.split("")[0] !== "C") {
                arr.push(data[i].contentsid);
            }
        }
        const result = yield assayModel.getUserAssayLike(arr, userId);
        res.status(200).json({ result });
    });
}
exports.getUserAssayLike = getUserAssayLike;
// ** 장소검색
function getSearchNameAssay(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { searchData } = req.body;
        let searchNameSpotList;
        if (!searchData) {
            searchData = "";
            searchNameSpotList = yield assayModel.getSearchNameAssay100(searchData);
        }
        else {
            searchNameSpotList = yield assayModel.getSearchNameAssay(searchData);
        }
        res.status(200).json(searchNameSpotList);
    });
}
exports.getSearchNameAssay = getSearchNameAssay;
