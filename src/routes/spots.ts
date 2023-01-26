import express, { Router } from "express";
import * as spotController from "../controllers/spotController";
import { isAuth, isAuthCheck } from "../services/jwt";

const router: Router = express.Router();
router.get("/all", spotController.getSpotCategoryList);
router.get("/all/:num", spotController.getSpotCategoryList);
router.get("/category/:category/:num", spotController.getSpotCategoryList);
router.get("/info/:contentId", spotController.getSpotInfo); // contentId로 Spot정보 가져오기
router.get("/tag/:tagId", spotController.getTagSpots); // tag로 관광지 리스트 가져오기
router.post("/search", spotController.getSearchNameSpots); // 이름으로 관광지 조회
router.get("/like/:contentsId", isAuthCheck, spotController.changeLike); // 좋아요 토글
router.get("/likeall/", isAuthCheck, spotController.getLikeAll); // 좋아요 토글
router.get("/likeCheck/:contentsId", isAuthCheck, spotController.checkSpotLike); // 좋아요 토
router.post("/userSpotLike", isAuthCheck, spotController.getUserSpotLike);
router.post("/searchTag", spotController.getSearchNameTag);
router.post("/addReview/:contentsid", spotController.addSpotReview);

export default router;
