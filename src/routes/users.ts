import express, { Router } from "express";
import * as userController from "../controllers/userController";
import * as characterController from "../controllers/characterController";
import { isAuth, isAuthCheck } from "../services/jwt";

const router: Router = express.Router();

router.post("/info", isAuth, userController.userInfo);
router.post("/userLogin", userController.userLogin);
router.post("/userRegister", userController.userRegister);
router.post("/userIdCheck", userController.userIdCheck);
router.post("/sendEmail", userController.sendEmail);
router.get("/userLogout", userController.userLogout);

// ** 테스트를 위한 경로 설정
router.get("/findAllUser", userController.AllUsers);
router.get("/userLevelUp", characterController.addUserLevelTest);

router.post("/expData", isAuthCheck, userController.getUserExpData);

export default router;
