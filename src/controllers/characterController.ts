import express, { Request, Response } from "express";
import * as userModel from '../models/userModel';

// ** 유저에게 리워드 지급
export async function addUserLevel(req:Request, res:Response){
    const userId = req.params.userId;
    // ** 레벨 지급은 임시로 3씩 지급하는것으로 한다.
    const result = await userModel.addUserLevel(userId, 3);
    res.status(200).json(result);
}

export async function addUserLevelTest(req:Request, res:Response){
    // ** 레벨 지급은 임시로 3씩 지급하는것으로 한다.
    const result = await userModel.addUserLevel("testbk", 3);
    res.status(200).json(result);
}