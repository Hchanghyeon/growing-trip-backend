import mongoose from "mongoose";

const { Schema } = mongoose;

const assaySchema = new Schema({
  userId: { type: String },
  title: { type: String },
  address: { type: String },
  tag: [String],
  introduction: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  imgpath: { type: String },
  formatTime: { type: String },
  Time: { type: Date, default: Date.now },
  likeNum: { type: Number },
});

const Assay = mongoose.model("assay", assaySchema, "assay");

// 게시글 등록하기
export async function addAssay(assay: any) {
  return await Assay.insertMany(assay);
}

// ID로 조회해서 게시글 가져오기
export async function getUserAssay(userId: string) {
  return await Assay.find({ userId }).sort({ Time: -1 });
}

export async function getUserContentsId(contentsId: string) {
  return await Assay.find({ _id: contentsId });
}

export async function getAllAssay() {
  return await Assay.find({}).sort({ Time: -1 });
}

export async function getCountAssay() {
  return await Assay.count();
}

// 관광지 전체 카테고리별 리스트 10개씩 순차적으로 가져오기
export async function getAssay20(num: any) {
  return await Assay.find({}).skip(num).limit(20);
}

// 좋아요 1 늘리기
export async function plusLikeNum(contentsid: string) {
  return await Assay.updateOne({ _id: contentsid }, { $inc: { likeNum: 1 } });
}

// 좋아요 1 줄이기
export async function minusLikeNum(contentsid: string) {
  return await Assay.updateOne({ _id: contentsid }, { $inc: { likeNum: -1 } });
}

// 좋아요 개수 반환
export async function getLikeNum(contentsid: string) {
  return await Assay.findOne({ _id: contentsid });
}

export async function getUserAssayLike(arr: any, userid: string) {
  return await Assay.find({ userid, _id: arr });
}

// 이름을 기준으로 포함된 리스트 가져오기
export async function getSearchNameAssay(title: string) {
  return await Assay.find({ title: { $regex: title } });
}

export async function getSearchNameAssay100(title: string) {
  return await Assay.find({ title: { $regex: title } })
    .sort({ likeNum: -1 })
    .limit(100);
}
