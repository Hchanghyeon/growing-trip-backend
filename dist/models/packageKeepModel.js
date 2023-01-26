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
exports.getPackage = exports.getPackage100 = exports.addPackage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const packageKeepSchema = new Schema({
    user_id: { type: String },
    title: { type: String },
    address: { type: String },
    roadaddress: { type: String },
    introduction: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    phoneno: { type: String },
    photoid: { type: Number },
    imgpath: { type: String },
    thumbnailpath: { type: String },
    likeNum: { type: Number },
});
const pkKeep = mongoose_1.default.model("PackageKeep", packageKeepSchema, "PackageKeep");
// 패키지킵 등록하기
function addPackage(packageData) {
    return __awaiter(this, void 0, void 0, function* () {
        return pkKeep.insertMany(pkKeep)
            .then((data) => true)
            .catch((err) => {
            return false;
        });
    });
}
exports.addPackage = addPackage;
// 패키지킵 리스트 불러오기
function getPackage100() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pkKeep.find({}, { _id: 0 }).limit(100);
    });
}
exports.getPackage100 = getPackage100;
// 패키지킵 리스트 전체 리스트 10개씩 순차적으로 가져오기
function getPackage(num) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pkKeep.find({}).skip(num).limit(10);
    });
}
exports.getPackage = getPackage;
