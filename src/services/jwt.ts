import jwt from "jsonwebtoken";
import express, { NextFunction ,Request, Response } from "express";
import { config } from "../config/config.js";
import * as userModel from "../models/userModel.js";
import { user } from "../interfaces/userDto.js";

const { secretKey, expiresInSec } = config.jwt;

const AUTH_ERROR = { message: "Authentication Error" };

// jwt accessToken 생성
export function createJwtToken(id:any) {
  return jwt.sign({ id }, secretKey, { expiresIn: expiresInSec });
}

// jwt refreshToken 생성
export function createRefreshToken() {
  return jwt.sign({}, secretKey, { expiresIn: "14d" });
}

// 쿠키 인증기반
export const isAuth = async (req:Request, res:Response, next:NextFunction) => {
  const { userId, accessToken } = req.body;
  if (!accessToken) {
    return res.status(401).json(AUTH_ERROR);
  } else {
    jwt.verify(accessToken, secretKey, async (error:any, decoded:any) => {
      if (error) {
        return res.status(401).json(AUTH_ERROR);
      }
      const user:any = await userModel.findByUserId(decoded.id);
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      next();
    });
  }
};

// 쿠키 인증기반(인증은 하나 해당 페이지에서 로그인이 안되어있어도 되는 경우)
export const isAuthCheck = async (req:Request, res:Response, next:NextFunction) => {
  let authHeader:any = req.headers.authorization;
  let accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
      next();
  } else {
    jwt.verify(accessToken, secretKey, async (error:any, decoded:any) => {
      if (error) {
        return res.status(401).json(AUTH_ERROR);

      }
      const user = await userModel.findByUserId(decoded.id);
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      req.body.authId = user.userId; // req.customData
      next();
    });
  }
};
