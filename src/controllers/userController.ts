import express, { Request, Response } from "express";
import { user } from "../interfaces/userDto";
import { config } from "../config/config.js";
import { createJwtToken } from "../services/jwt.js";
import * as userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { smtpTransport } from "../services/mail";

import * as expModel from "../models/expModel";
import moment from "moment";

const { saltRounds } = config.bcrypt;
const cookieSetting = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60,
};

// 로그인 로직
export async function userLogin(req: Request, res: Response) {
  const { userId, userPw }: any = req.body;
  const user: user = await userModel.findByUserId(userId);

  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const isValidPassword = await bcrypt.compare(userPw, user.userPw);
  if (!isValidPassword) {
    return res.status(401).json({ message: " Invalid user or password" });
  }

  // 유저가 레벨업한 상태일때 ch_idx 변경
  let updateCharacter: boolean = false;
  if (user.userLevel >= 10) {
    updateCharacter = await userModel.updateCharacter(userId, 2);
  } else if (user.userLevel >= 20) {
    updateCharacter = await userModel.updateCharacter(userId, 3);
  } else if (user.userLevel >= 30) {
    updateCharacter = await userModel.updateCharacter(userId, 4);
  } else if (user.userLevel >= 40) {
    updateCharacter = await userModel.updateCharacter(userId, 5);
  }
  if (!updateCharacter) {
    console.log("캐릭터 업데이트 실패");
  }

  const accessToken: string = createJwtToken(user.userId);
  // httpOnly는 보안때문에 설정 / 쿠키 시간은 1시간
  res.cookie("accessToken", accessToken, cookieSetting);
  console.log(user);
  res.status(200).json({ accessToken, userId, imgSrc: user.imgSrc });
}

// 로그아웃 로직
export async function userLogout(req: Request, res: Response) {
  res.clearCookie("accessToken");
  res.redirect("/");
}

// 회원가입시 ID 중복 체크
export async function userIdCheck(req: Request, res: Response) {
  const { userId }: any = req.body;
  const result: boolean = await userModel.userIdCheck(userId);
  if (result) {
    return res.status(200).json({ result: true });
  } else {
    return res.status(200).json({ result: false });
  }
}

// 회원가입 로직
export async function userRegister(req: Request, res: Response) {
  const user: user = req.body;
  const userCheck: boolean = await userModel.userIdCheck(user.userId);
  if (userCheck) {
    return res.status(409).json({ message: `${user.userId} already exists` });
  }
  const hased: string = await bcrypt.hash(user.userPw, parseInt(saltRounds));
  user.regDate = new Date();
  user.userPw = hased;
  user.imgSrc = "/img/infoUserImg/user.png";
  user.userLevel = 1;
  user.ch_idx = 1;
  user.userExp = 0;

  const result: boolean = await userModel.createUser(user);
  if (result) {
    return res.status(200).json({ result: true });
  } else {
    return res.status(200).json({ result: false });
  }
}

export async function sendEmail(req: Request, res: Response) {
  const email: any = req.body.email;
  const number = generateRandom(111111, 999999);

  const mailOptions = {
    from: "changhyeonh@naver.com",
    to: email,
    subject: "[GrowT] 인증 메일 입니다",
    text: "오른쪽 숫자 6자리를 입력해주세요 : " + number,
  };

  const result = await smtpTransport.sendMail(
    mailOptions,
    (error, response) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ result: "error" });
      } else {
        return res.status(200).json({ result: number });
      }
    }
  );
}

function generateRandom(min: number, max: number) {
  const ranNum = Math.floor(Math.random() * (max - min + 1) + min);
  return ranNum;
}

export async function userInfo(req: Request, res: Response) {
  const { userId } = req.body;

  const data = await userModel.findByUserId(userId);
  if (data) {
    return res.status(200).json({ data });
  } else {
    return res.status(401).json({});
  }
}

export async function AllUsers(req: Request, res: Response) {
  const data = await userModel.getUserList();
  if (data) {
    return res.status(200).json({ data });
  } else {
    return res.status(401).json({});
  }
}

export async function getUserExpData(req: Request, res: Response) {
  const userId = req.body.authId;
  const result = await expModel.getUserExpData(userId);
  if (result) {
    return res.status(200).json({ result });
  } else {
    return res.status(401).json({});
  }
}
