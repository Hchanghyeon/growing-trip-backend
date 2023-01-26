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
exports.addSpotReview = exports.getSearchNameTag = exports.getUserSpotLike = exports.checkSpotLike = exports.getLikeAll = exports.changeLike = exports.getSearchNameSpots = exports.getCategorySpots = exports.getSpots = exports.getTagSpots = exports.getSpotInfo = exports.getSpotCategoryList = void 0;
const spotModel = __importStar(require("../models/spotModel"));
const assayModel = __importStar(require("../models/assayModel"));
const spotLikeModel = __importStar(require("../models/spotLikeModel"));
const moment_1 = __importDefault(require("moment"));
const characterLevel_1 = require("../services/characterLevel");
function getSpotCategoryList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let category = req.params.category;
        let num = parseInt(req.params.num);
        if (num === undefined) {
            num = 0;
        }
        let spotList;
        if (category === undefined) {
            spotList = yield spotModel.getSpots(num * 20);
        }
        else if (category === "c1" || category === "c4" || category === "c3") {
            spotList = yield spotModel.getCategorySpots(num * 20, category);
        }
        else if (category === "assay") {
            spotList = yield assayModel.getAssay20(num * 20);
        }
        else if (category === "landmark") {
            spotList = yield spotModel.getLandmarkSpot();
        }
        else {
            return res.status(400).json({ result: "noresult" });
        }
        res.status(200).json(spotList);
    });
}
exports.getSpotCategoryList = getSpotCategoryList;
function getSpotInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let contentsId = req.params.contentId;
        let spotInfo;
        spotInfo = yield spotModel.getOneSpot(contentsId);
        res.status(200).json(spotInfo);
    });
}
exports.getSpotInfo = getSpotInfo;
function getTagSpots(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let tagId = req.params.tagId;
        let tagSpotList;
        tagSpotList = yield spotModel.getTagSpots(tagId);
        res.status(200).json(tagSpotList);
    });
}
exports.getTagSpots = getTagSpots;
// 관광지 전체 리스트 10개씩 순차적으로 가져오기
function getSpots(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const num = req.params.num;
        const spotNum = num * 10;
        const spotList = yield spotModel.getSpots(spotNum);
        res.status(200).json(spotList);
    });
}
exports.getSpots = getSpots;
// 관광지 전체 카테고리별로 10개씩 순차적으로 가져오기
function getCategorySpots(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const num = req.params.num;
        const contentValue = req.params.contentsValue;
        const spotNum = num * 10;
        const spotList = yield spotModel.getCategorySpots(spotNum, contentValue);
        res.status(200).json(spotList);
    });
}
exports.getCategorySpots = getCategorySpots;
// ** 장소검색
function getSearchNameSpots(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { searchData } = req.body;
        let searchNameSpotList;
        if (!searchData) {
            searchData = "";
            searchNameSpotList = yield spotModel.getSearchNameSpots100(searchData);
        }
        else {
            searchNameSpotList = yield spotModel.getSearchNameSpots(searchData);
        }
        res.status(200).json(searchNameSpotList);
    });
}
exports.getSearchNameSpots = getSearchNameSpots;
function changeLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let contentsId = req.params.contentsId;
        let userId = req.body.authId;
        let info = {
            userid: userId,
            contentsid: contentsId,
        };
        if (!userId) {
            res.status(401).json({ result: "로그인 필요" });
        }
        else {
            // 우선 사용자 ID와 관광지 ID로 조회해서 사용자가 좋아요를 누른적이 있었는지 체크해보기
            let result = yield spotLikeModel.checkSpotLike(info);
            let score = 0;
            // 값이 없으면 데이터 추가
            if (!result) {
                const assayResult = yield spotLikeModel.changeSpotLike(info);
                console.log(assayResult);
                try {
                    yield spotModel.plusLikeNum(info.contentsid);
                    // 경험치 처리 메소드 함수 모음
                }
                catch (e) {
                    console.log(e);
                }
                try {
                    yield assayModel.plusLikeNum(info.contentsid);
                    const assayData = yield assayModel.getUserContentsId(info.contentsid);
                    score = 1;
                    if (score > 0) {
                        console.log(assayData);
                        yield (0, characterLevel_1.addExpData)(assayData[0].userId, score, "assayLike", userId);
                        const data = yield (0, characterLevel_1.updateUserExp)(assayData[0].userId, score);
                        yield (0, characterLevel_1.updateUserCharacter)(assayData[0].userId);
                    }
                }
                catch (e) {
                    console.log(e);
                }
                let spot = yield spotModel.getLikeNum(info.contentsid);
                let data = {
                    result: 1,
                    likeNum: spot === null || spot === void 0 ? void 0 : spot.likeNum,
                };
                res.status(200).json(data);
                // 있으면 데이터 삭제
            }
            else {
                yield spotLikeModel.deleteSpotLike(info);
                try {
                    yield spotModel.minusLikeNum(info.contentsid);
                }
                catch (e) {
                    console.log(e);
                }
                try {
                    yield assayModel.minusLikeNum(info.contentsid);
                    const assayData = yield assayModel.getUserContentsId(info.contentsid);
                    console.log(assayData);
                    score = -1;
                    if (score === -1) {
                        yield (0, characterLevel_1.addExpData)(assayData[0].userId, score, "assayLike", userId);
                        const data = yield (0, characterLevel_1.updateUserExp)(assayData[0].userId, score);
                        yield (0, characterLevel_1.updateUserCharacter)(assayData[0].userId);
                    }
                }
                catch (e) {
                    console.log(e);
                }
                let spot = yield spotModel.getLikeNum(info.contentsid);
                let data = {
                    result: 2,
                    likeNum: spot === null || spot === void 0 ? void 0 : spot.likeNum,
                };
                res.status(200).json(data);
            }
        }
    });
}
exports.changeLike = changeLike;
function getLikeAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.body.authId;
        if (!userId) {
            res.status(401).json({ result: "로그인 필요" });
        }
        else {
            const data = yield spotLikeModel.getLikeAll(userId);
            res.status(200).json({ data });
        }
    });
}
exports.getLikeAll = getLikeAll;
function checkSpotLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.body.authId;
        let contentsId = req.params.contentsId;
        let info = {
            userid: userId,
            contentsid: contentsId,
        };
        if (!userId) {
            res.status(401).json({ result: "로그인 필요" });
        }
        else {
            const data = yield spotLikeModel.checkSpotLike(info);
            if (data !== null) {
                res.status(200).json({ data });
            }
            else {
                const data = {
                    result: "none",
                };
                res.status(204).json({ data });
            }
        }
    });
}
exports.checkSpotLike = checkSpotLike;
function getUserSpotLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const userId = req.body.authId;
        const arr = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].contentsid.split("")[0] === "C") {
                arr.push(data[i].contentsid);
            }
        }
        const result = yield spotModel.getUserSpotLike(arr, userId);
        res.status(200).json({ result });
    });
}
exports.getUserSpotLike = getUserSpotLike;
function getSearchNameTag(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { searchData } = req.body;
        let searchNameSpotList;
        if (!searchData || searchData === "") {
            searchData = "제주";
            searchNameSpotList = yield spotModel.getSearchNameTag100(searchData);
        }
        else {
            searchNameSpotList = yield spotModel.getSearchNameTag(searchData);
        }
        res.status(200).json(searchNameSpotList);
    });
}
exports.getSearchNameTag = getSearchNameTag;
function addSpotReview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let reviewData = req.body;
        const contentsid = req.params.contentsid;
        reviewData = Object.assign(Object.assign({}, reviewData), { time: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss") });
        yield spotModel.addSpotReview(contentsid, reviewData);
        yield spotModel.changeStartAvg(contentsid);
        let score = 0;
        if (reviewData.locationAuth) {
            score += 3;
        }
        if (reviewData.landmarkAuth) {
            score += 5;
        }
        // 경험치 처리 메소드 함수 모음
        if (score > 0) {
            yield (0, characterLevel_1.addExpData)(reviewData.userId, score, "review", "");
            const data = yield (0, characterLevel_1.updateUserExp)(reviewData.userId, score);
            yield (0, characterLevel_1.updateUserCharacter)(reviewData.userId);
        }
        res.status(200).json({ result: "ok" });
    });
}
exports.addSpotReview = addSpotReview;
