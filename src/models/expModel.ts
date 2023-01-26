import { expModelDto } from "../interfaces/expModelDto";
import mongoose from "mongoose";

const { Schema } = mongoose;

const expSchema = new Schema(
  {
    userId: { type: String },
    category: { type: String },
    score: { type: Number },
    likeId: { type: String },
    time: { type: String },
  },
  {
    versionKey: false,
  }
);

const exp = mongoose.model("exp", expSchema, "exp");

export async function addExpData(expData: expModelDto) {
  return await exp.insertMany(expData);
}

export async function getUserExpData(userId: string) {
  return await exp.find({ userId });
}
