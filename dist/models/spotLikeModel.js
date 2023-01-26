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
exports.getLikeAll = exports.checkSpotLike = exports.deleteSpotLike = exports.changeSpotLike = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const spotLikeSchema = new Schema({
    contentsid: { type: String },
    userid: { type: String },
}, {
    versionKey: false,
});
const SpotLike = mongoose_1.default.model("SpotLike", spotLikeSchema, "SpotLike");
// 좋아요 추가하기
function changeSpotLike(info) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield SpotLike.insertMany(info);
    });
}
exports.changeSpotLike = changeSpotLike;
// 좋아요 삭제하기
function deleteSpotLike(info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield SpotLike.deleteOne(info);
    });
}
exports.deleteSpotLike = deleteSpotLike;
// 좋아요 되어있는지 체크 해보기
function checkSpotLike(info) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield SpotLike.findOne(info);
    });
}
exports.checkSpotLike = checkSpotLike;
// 좋아요 되어있는지 체크 해보기
function getLikeAll(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield SpotLike.find({ userid: userid });
    });
}
exports.getLikeAll = getLikeAll;
