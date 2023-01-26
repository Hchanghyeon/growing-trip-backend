import express, { Request, Response } from "express";
import * as spotModel from "../models/spotModel";
import * as assayModel from "../models/assayModel";
import * as spotLikeModel from "../models/spotLikeModel";
import { spot } from "../interfaces/spotDto";
import { spotLike } from "../interfaces/spotLikeDto";
import moment from "moment";
import {
  addExpData,
  updateUserExp,
  updateUserCharacter,
} from "../services/characterLevel";

export async function getSpotCategoryList(req: Request, res: Response) {
  let category: string = req.params.category;
  let num: number = parseInt(req.params.num);
  if (num === undefined) {
    num = 0;
  }
  let spotList;
  if (category === undefined) {
    spotList = await spotModel.getSpots(num * 20);
  } else if (category === "c1" || category === "c4" || category === "c3") {
    spotList = await spotModel.getCategorySpots(num * 20, category);
  } else if (category === "assay") {
    spotList = await assayModel.getAssay20(num * 20);
  } else if (category === "landmark") {
    spotList = await spotModel.getLandmarkSpot();
  } else {
    return res.status(400).json({ result: "noresult" });
  }
  res.status(200).json(spotList);
}

export async function getSpotInfo(req: Request, res: Response) {
  let contentsId: string = req.params.contentId;
  let spotInfo;

  spotInfo = await spotModel.getOneSpot(contentsId);
  res.status(200).json(spotInfo);
}

export async function getTagSpots(req: Request, res: Response) {
  let tagId: string = req.params.tagId;
  let tagSpotList;

  tagSpotList = await spotModel.getTagSpots(tagId);

  res.status(200).json(tagSpotList);
}

// 관광지 전체 리스트 10개씩 순차적으로 가져오기
export async function getSpots(req: Request, res: Response) {
  const num: any = req.params.num;
  const spotNum = num * 10;
  const spotList = await spotModel.getSpots(spotNum);
  res.status(200).json(spotList);
}

// 관광지 전체 카테고리별로 10개씩 순차적으로 가져오기
export async function getCategorySpots(req: Request, res: Response) {
  const num: any = req.params.num;
  const contentValue = req.params.contentsValue;
  const spotNum = num * 10;
  const spotList = await spotModel.getCategorySpots(spotNum, contentValue);
  res.status(200).json(spotList);
}

// ** 장소검색
export async function getSearchNameSpots(req: Request, res: Response) {
  let { searchData } = req.body;
  let searchNameSpotList;

  if (!searchData) {
    searchData = "";
    searchNameSpotList = await spotModel.getSearchNameSpots100(searchData);
  } else {
    searchNameSpotList = await spotModel.getSearchNameSpots(searchData);
  }
  res.status(200).json(searchNameSpotList);
}

export async function changeLike(req: Request, res: Response) {
  let contentsId: string = req.params.contentsId;
  let userId = req.body.authId;

  let info = {
    userid: userId,
    contentsid: contentsId,
  };

  if (!userId) {
    res.status(401).json({ result: "로그인 필요" });
  } else {
    // 우선 사용자 ID와 관광지 ID로 조회해서 사용자가 좋아요를 누른적이 있었는지 체크해보기
    let result: any = await spotLikeModel.checkSpotLike(info);
    let score = 0;
    // 값이 없으면 데이터 추가
    if (!result) {
      const assayResult = await spotLikeModel.changeSpotLike(info);
      console.log(assayResult);
      try {
        await spotModel.plusLikeNum(info.contentsid);
        // 경험치 처리 메소드 함수 모음
      } catch (e) {
        console.log(e);
      }
      try {
        await assayModel.plusLikeNum(info.contentsid);
        const assayData: any = await assayModel.getUserContentsId(
          info.contentsid
        );

        score = 1;
        if (score > 0) {
          console.log(assayData);
          await addExpData(assayData[0].userId, score, "assayLike", userId);
          const data = await updateUserExp(assayData[0].userId, score);
          await updateUserCharacter(assayData[0].userId);
        }
      } catch (e) {
        console.log(e);
      }
      let spot = await spotModel.getLikeNum(info.contentsid);
      let data = {
        result: 1,
        likeNum: spot?.likeNum,
      };
      res.status(200).json(data);
      // 있으면 데이터 삭제
    } else {
      await spotLikeModel.deleteSpotLike(info);
      try {
        await spotModel.minusLikeNum(info.contentsid);
      } catch (e) {
        console.log(e);
      }
      try {
        await assayModel.minusLikeNum(info.contentsid);
        const assayData: any = await assayModel.getUserContentsId(
          info.contentsid
        );

        console.log(assayData);
        score = -1;
        if (score === -1) {
          await addExpData(assayData[0].userId, score, "assayLike", userId);
          const data = await updateUserExp(assayData[0].userId, score);
          await updateUserCharacter(assayData[0].userId);
        }
      } catch (e) {
        console.log(e);
      }
      let spot = await spotModel.getLikeNum(info.contentsid);
      let data = {
        result: 2,
        likeNum: spot?.likeNum,
      };
      res.status(200).json(data);
    }
  }
}

export async function getLikeAll(req: Request, res: Response) {
  let userId = req.body.authId;
  if (!userId) {
    res.status(401).json({ result: "로그인 필요" });
  } else {
    const data = await spotLikeModel.getLikeAll(userId);
    res.status(200).json({ data });
  }
}

export async function checkSpotLike(req: Request, res: Response) {
  let userId = req.body.authId;
  let contentsId: string = req.params.contentsId;

  let info = {
    userid: userId,
    contentsid: contentsId,
  };

  if (!userId) {
    res.status(401).json({ result: "로그인 필요" });
  } else {
    const data = await spotLikeModel.checkSpotLike(info);
    if (data !== null) {
      res.status(200).json({ data });
    } else {
      const data = {
        result: "none",
      };
      res.status(204).json({ data });
    }
  }
}

export async function getUserSpotLike(req: Request, res: Response) {
  const data = req.body;
  const userId = req.body.authId;
  const arr: any = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].contentsid.split("")[0] === "C") {
      arr.push(data[i].contentsid);
    }
  }
  const result = await spotModel.getUserSpotLike(arr, userId);
  res.status(200).json({ result });
}

export async function getSearchNameTag(req: Request, res: Response) {
  let { searchData } = req.body;
  let searchNameSpotList;

  if (!searchData || searchData === "") {
    searchData = "제주";
    searchNameSpotList = await spotModel.getSearchNameTag100(searchData);
  } else {
    searchNameSpotList = await spotModel.getSearchNameTag(searchData);
  }
  res.status(200).json(searchNameSpotList);
}

export async function addSpotReview(req: Request, res: Response) {
  let reviewData: any = req.body;
  const contentsid: string = req.params.contentsid;
  reviewData = {
    ...reviewData,
    time: moment().format("YYYY-MM-DD HH:mm:ss"),
  };
  await spotModel.addSpotReview(contentsid, reviewData);
  await spotModel.changeStartAvg(contentsid);

  let score = 0;

  if (reviewData.locationAuth) {
    score += 3;
  }

  if (reviewData.landmarkAuth) {
    score += 5;
  }

  // 경험치 처리 메소드 함수 모음
  if (score > 0) {
    await addExpData(reviewData.userId, score, "review", "");
    const data = await updateUserExp(reviewData.userId, score);
    await updateUserCharacter(reviewData.userId);
  }

  res.status(200).json({ result: "ok" });
}
