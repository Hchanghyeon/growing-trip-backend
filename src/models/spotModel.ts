import * as spotModel from "../models/spotModel.js";
import { spot } from "../interfaces/spotDto.js";
import mongoose from "mongoose";

const { Schema } = mongoose;

const spotSchema = new Schema({
  contentsid: { type: String },
  contentsvalue: { type: String },
  contentslabel: { type: String },
  title: { type: String },
  address: { type: String },
  roadaddress: { type: String },
  tag: [String],
  introduction: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  phoneno: { type: String },
  photoid: { type: Number },
  imgpath: { type: String },
  thumbnailpath: { type: String },
  likeNum: { type: Number },
  starNum: { type: Number },
  review: [Object],
  landmark: { type: Boolean },
});

const Tour = mongoose.model("Tour", spotSchema, "Tour");

// 관광지 전체 리스트 불러오기
export async function getSpotList() {
  return await Tour.find({}, { _id: 0 }).limit(10);
}

// 관광지 전체 리스트 불러오기
export async function getSpotList100() {
  return await Tour.find({}, { _id: 0 }).limit(100);
}

export async function getLandmarkSpot() {
  return await Tour.find({ landmark: true }, { _id: 0 }).limit(100);
}

// 관광지 전체 리스트 10개씩 순차적으로 가져오기
export async function getSpots(num: number) {
  return await Tour.find({}).skip(num).limit(20);
}

// 관광지 전체 카테고리별 리스트 10개씩 순차적으로 가져오기
export async function getCategorySpots(num: number, contentValue: string) {
  return await Tour.find({ contentsvalue: contentValue }).skip(num).limit(20);
}

// 태그를 눌렀을 때 해당 태그에 속한 관광지 리스트 10개씩 가져오기
export async function getLimitTagSpots(num: number, tagId: string) {
  return await Tour.find({ tag: { $in: tagId } })
    .skip(num)
    .limit(10);
}

// 관광지 ID를 기준으로 1개만 가져오기
export async function getOneSpot(contentsId: string) {
  return await Tour.find({ contentsid: contentsId });
}

// 태그를 눌렀을 때 해당 태그에 속한 관광지 리스트만 가져오기
export async function getTagSpots(tagId: string) {
  return await Tour.find({ tag: { $in: tagId } });
}

// 카테고리 별 리스트 불러오기(c1:관광지, c3:숙박, c4:음식점)
export async function getCategoryList(contentValue: string) {
  return await Tour.find({ contentsvalue: contentValue }).limit(100);
}

// 이름을 기준으로 포함된 리스트 가져오기
export async function getSearchNameSpots(title: string) {
  return await Tour.find({ title: { $regex: title } });
}

export async function getSearchNameSpots100(title: string) {
  return await Tour.find({ title: { $regex: title } })
    .sort({ likeNum: -1 })
    .limit(100);
}

// 이름을 기준으로 포함된 리스트 가져오기
export async function getSearchNameTag(title: string) {
  return await Tour.find({ tag: { $regex: title } });
}

export async function getSearchNameTag100(title: string) {
  return await Tour.find({ tag: { $regex: title } })
    .sort({ likeNum: -1 })
    .limit(100);
}

// 좋아요 1 늘리기
export async function plusLikeNum(contentsid: string) {
  return await Tour.updateOne(
    { contentsid: contentsid },
    { $inc: { likeNum: 1 } }
  );
}

// 좋아요 1 줄이기
export async function minusLikeNum(contentsid: string) {
  return await Tour.updateOne(
    { contentsid: contentsid },
    { $inc: { likeNum: -1 } }
  );
}

// 좋아요 개수 반환
export async function getLikeNum(contentsid: string) {
  return await Tour.findOne({ contentsid });
}

// 좋아요 상위 5개 리스트 반환
export async function getLikeRank() {
  return await Tour.find({}).sort({ likeNum: -1 }).limit(5);
}

export async function getUserSpotLike(arr: any, userid: string) {
  return await Tour.find({ userid, contentsid: arr });
}

export async function addSpotReview(contentsid: string, reviewData: object) {
  return await Tour.updateOne(
    { contentsid: contentsid },
    { $push: { review: reviewData } }
  );
}

export async function changeStartAvg(contentsid: string) {
  return await Tour.updateOne({ contentsid }, [
    { $set: { starNum: { $avg: "$review.starValue" } } },
  ]);
}
