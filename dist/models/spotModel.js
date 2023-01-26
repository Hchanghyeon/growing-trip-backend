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
exports.changeStartAvg = exports.addSpotReview = exports.getUserSpotLike = exports.getLikeRank = exports.getLikeNum = exports.minusLikeNum = exports.plusLikeNum = exports.getSearchNameTag100 = exports.getSearchNameTag = exports.getSearchNameSpots100 = exports.getSearchNameSpots = exports.getCategoryList = exports.getTagSpots = exports.getOneSpot = exports.getLimitTagSpots = exports.getCategorySpots = exports.getSpots = exports.getLandmarkSpot = exports.getSpotList100 = exports.getSpotList = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const spotSchema = new Schema({
    contentsid: { type: String },
    contentsvalue: { type: String },
    contentslabel: { type: String },
    title: { type: String },
    address: { type: String },
    roadaddress: { type: String },
    tag: [String],
    introduction: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    phoneno: { type: String },
    photoid: { type: Number },
    imgpath: { type: String },
    thumbnailpath: { type: String },
    likeNum: { type: Number },
    starNum: { type: Number },
    review: [Object],
    landmark: { type: Boolean },
});
const Tour = mongoose_1.default.model("Tour", spotSchema, "Tour");
// 관광지 전체 리스트 불러오기
function getSpotList() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({}, { _id: 0 }).limit(10);
    });
}
exports.getSpotList = getSpotList;
// 관광지 전체 리스트 불러오기
function getSpotList100() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({}, { _id: 0 }).limit(100);
    });
}
exports.getSpotList100 = getSpotList100;
function getLandmarkSpot() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ landmark: true }, { _id: 0 }).limit(100);
    });
}
exports.getLandmarkSpot = getLandmarkSpot;
// 관광지 전체 리스트 10개씩 순차적으로 가져오기
function getSpots(num) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({}).skip(num).limit(20);
    });
}
exports.getSpots = getSpots;
// 관광지 전체 카테고리별 리스트 10개씩 순차적으로 가져오기
function getCategorySpots(num, contentValue) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ contentsvalue: contentValue }).skip(num).limit(20);
    });
}
exports.getCategorySpots = getCategorySpots;
// 태그를 눌렀을 때 해당 태그에 속한 관광지 리스트 10개씩 가져오기
function getLimitTagSpots(num, tagId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ tag: { $in: tagId } })
            .skip(num)
            .limit(10);
    });
}
exports.getLimitTagSpots = getLimitTagSpots;
// 관광지 ID를 기준으로 1개만 가져오기
function getOneSpot(contentsId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ contentsid: contentsId });
    });
}
exports.getOneSpot = getOneSpot;
// 태그를 눌렀을 때 해당 태그에 속한 관광지 리스트만 가져오기
function getTagSpots(tagId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ tag: { $in: tagId } });
    });
}
exports.getTagSpots = getTagSpots;
// 카테고리 별 리스트 불러오기(c1:관광지, c3:숙박, c4:음식점)
function getCategoryList(contentValue) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ contentsvalue: contentValue }).limit(100);
    });
}
exports.getCategoryList = getCategoryList;
// 이름을 기준으로 포함된 리스트 가져오기
function getSearchNameSpots(title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ title: { $regex: title } });
    });
}
exports.getSearchNameSpots = getSearchNameSpots;
function getSearchNameSpots100(title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ title: { $regex: title } })
            .sort({ likeNum: -1 })
            .limit(100);
    });
}
exports.getSearchNameSpots100 = getSearchNameSpots100;
// 이름을 기준으로 포함된 리스트 가져오기
function getSearchNameTag(title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ tag: { $regex: title } });
    });
}
exports.getSearchNameTag = getSearchNameTag;
function getSearchNameTag100(title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ tag: { $regex: title } })
            .sort({ likeNum: -1 })
            .limit(100);
    });
}
exports.getSearchNameTag100 = getSearchNameTag100;
// 좋아요 1 늘리기
function plusLikeNum(contentsid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.updateOne({ contentsid: contentsid }, { $inc: { likeNum: 1 } });
    });
}
exports.plusLikeNum = plusLikeNum;
// 좋아요 1 줄이기
function minusLikeNum(contentsid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.updateOne({ contentsid: contentsid }, { $inc: { likeNum: -1 } });
    });
}
exports.minusLikeNum = minusLikeNum;
// 좋아요 개수 반환
function getLikeNum(contentsid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.findOne({ contentsid });
    });
}
exports.getLikeNum = getLikeNum;
// 좋아요 상위 5개 리스트 반환
function getLikeRank() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({}).sort({ likeNum: -1 }).limit(5);
    });
}
exports.getLikeRank = getLikeRank;
function getUserSpotLike(arr, userid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.find({ userid, contentsid: arr });
    });
}
exports.getUserSpotLike = getUserSpotLike;
function addSpotReview(contentsid, reviewData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.updateOne({ contentsid: contentsid }, { $push: { review: reviewData } });
    });
}
exports.addSpotReview = addSpotReview;
function changeStartAvg(contentsid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Tour.updateOne({ contentsid }, [
            { $set: { starNum: { $avg: "$review.starValue" } } },
        ]);
    });
}
exports.changeStartAvg = changeStartAvg;
