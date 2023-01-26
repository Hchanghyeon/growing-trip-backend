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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchNameAssay100 = exports.getSearchNameAssay = exports.getUserAssayLike = exports.getLikeNum = exports.minusLikeNum = exports.plusLikeNum = exports.getAssay20 = exports.getCountAssay = exports.getAllAssay = exports.getUserContentsId = exports.getUserAssay = exports.addAssay = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const assaySchema = new Schema({
    userId: { type: String },
    title: { type: String },
    address: { type: String },
    tag: [String],
    introduction: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    imgpath: { type: String },
    formatTime: { type: String },
    Time: { type: Date, default: Date.now },
    likeNum: { type: Number },
});
const Assay = mongoose_1.default.model("assay", assaySchema, "assay");
// 게시글 등록하기
function addAssay(assay) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.insertMany(assay);
    });
}
exports.addAssay = addAssay;
// ID로 조회해서 게시글 가져오기
function getUserAssay(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.find({ userId }).sort({ Time: -1 });
    });
}
exports.getUserAssay = getUserAssay;
function getUserContentsId(contentsId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.find({ _id: contentsId });
    });
}
exports.getUserContentsId = getUserContentsId;
function getAllAssay() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.find({}).sort({ Time: -1 });
    });
}
exports.getAllAssay = getAllAssay;
function getCountAssay() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.count();
    });
}
exports.getCountAssay = getCountAssay;
// 관광지 전체 카테고리별 리스트 10개씩 순차적으로 가져오기
function getAssay20(num) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.find({}).skip(num).limit(20);
    });
}
exports.getAssay20 = getAssay20;
// 좋아요 1 늘리기
function plusLikeNum(contentsid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.updateOne({ _id: contentsid }, { $inc: { likeNum: 1 } });
    });
}
exports.plusLikeNum = plusLikeNum;
// 좋아요 1 줄이기
function minusLikeNum(contentsid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.updateOne({ _id: contentsid }, { $inc: { likeNum: -1 } });
    });
}
exports.minusLikeNum = minusLikeNum;
// 좋아요 개수 반환
function getLikeNum(contentsid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.findOne({ _id: contentsid });
    });
}
exports.getLikeNum = getLikeNum;
function getUserAssayLike(arr, userid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.find({ userid, _id: arr });
    });
}
exports.getUserAssayLike = getUserAssayLike;
// 이름을 기준으로 포함된 리스트 가져오기
function getSearchNameAssay(title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.find({ title: { $regex: title } });
    });
}
exports.getSearchNameAssay = getSearchNameAssay;
function getSearchNameAssay100(title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Assay.find({ title: { $regex: title } })
            .sort({ likeNum: -1 })
            .limit(100);
    });
}
exports.getSearchNameAssay100 = getSearchNameAssay100;
