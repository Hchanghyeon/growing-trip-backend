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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spotController = __importStar(require("../controllers/spotController"));
const jwt_1 = require("../services/jwt");
const router = express_1.default.Router();
router.get("/all", spotController.getSpotCategoryList);
router.get("/all/:num", spotController.getSpotCategoryList);
router.get("/category/:category/:num", spotController.getSpotCategoryList);
router.get("/info/:contentId", spotController.getSpotInfo); // contentId로 Spot정보 가져오기
router.get("/tag/:tagId", spotController.getTagSpots); // tag로 관광지 리스트 가져오기
router.post("/search", spotController.getSearchNameSpots); // 이름으로 관광지 조회
router.get("/like/:contentsId", jwt_1.isAuthCheck, spotController.changeLike); // 좋아요 토글
router.get("/likeall/", jwt_1.isAuthCheck, spotController.getLikeAll); // 좋아요 토글
router.get("/likeCheck/:contentsId", jwt_1.isAuthCheck, spotController.checkSpotLike); // 좋아요 토
router.post("/userSpotLike", jwt_1.isAuthCheck, spotController.getUserSpotLike);
router.post("/searchTag", spotController.getSearchNameTag);
router.post("/addReview/:contentsid", spotController.addSpotReview);
exports.default = router;
