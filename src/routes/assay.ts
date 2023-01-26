import express, { Router } from "express";
import * as assayController from "../controllers/assayController";
import { isAuth, isAuthCheck } from "../services/jwt";

const router: Router = express.Router();
router.post("/user", assayController.getUserAssay);
router.post("/post", assayController.postAssay);
router.get("/all", assayController.getAllAssay);
router.post("/userAssayLike", isAuthCheck, assayController.getUserAssayLike);
router.post("/search", assayController.getSearchNameAssay); // 이름으로 관광지 조회

export default router;
