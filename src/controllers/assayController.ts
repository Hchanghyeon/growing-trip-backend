import { Request, Response } from "express";
import * as assayModel from "../models/assayModel";
import * as addressTranslate from "../services/addressTranslate";
import moment from "moment";

export async function getUserAssay(req: Request, res: Response) {
  const { userId } = req.body;
  const data = await assayModel.getUserAssay(userId);
  res.status(200).json({ data });
}

export async function getAllAssay(req: Request, res: Response) {
  const data = await assayModel.getAllAssay();
  res.status(200).json({ data });
}

export async function postAssay(req: any, res: Response) {
  const { userId, title, address, introduction } = req.body;
  const tag = JSON.parse(req.body.tag);
  const file = req.files.file;
  const time = new Date().getTime();
  let savePath =
    __dirname + "/../../src/public/img/assayUserImg/" + time + "_" + file.name;

  let addressXY: any;
  try {
    addressXY = await addressTranslate.xyAddress(req.body.address);
  } catch (err: any) {
    return res.status(404).json({ result: "not Exist" });
  }

  if (addressXY.x === undefined || addressXY.y === undefined) {
    return res.status(404).json({ result: "not Exist" });
  }

  const assay = {
    userId,
    title,
    address,
    tag,
    introduction,
    latitude: addressXY.y,
    longitude: addressXY.x,
    imgpath: "/img/assayUserImg/" + time + "_" + file.name,
    formatTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    likeNum: 0,
  };

  file.mv(savePath, async (err: any) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ data: "error" });
    } else {
      await assayModel.addAssay(assay);
      return res.status(200).json({ data: "success" });
    }
  });
}

export async function getUserAssayLike(req: Request, res: Response) {
  const data = req.body;
  const userId = req.body.authId;
  const arr: any = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].contentsid.split("")[0] !== "C") {
      arr.push(data[i].contentsid);
    }
  }
  const result = await assayModel.getUserAssayLike(arr, userId);

  res.status(200).json({ result });
}

// ** 장소검색
export async function getSearchNameAssay(req: Request, res: Response) {
  let { searchData } = req.body;
  let searchNameSpotList;

  if (!searchData) {
    searchData = "";
    searchNameSpotList = await assayModel.getSearchNameAssay100(searchData);
  } else {
    searchNameSpotList = await assayModel.getSearchNameAssay(searchData);
  }
  res.status(200).json(searchNameSpotList);
}
