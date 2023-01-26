import * as expModel from "../models/expModel";
import * as userModel from "../models/userModel";
import moment from "moment";

// 유저 경험치 업데이트 관련 로그
export async function addExpData(
  userId: string,
  score: number,
  category: string,
  likeId: string
) {
  const expData = {
    userId,
    category,
    score,
    likeId,
    time: moment().format("YYYY-MM-DD HH:mm"),
  };

  await expModel.addExpData(expData);
}

// 유저 경험치 업데이트
export async function updateUserExp(userId: string, score: number) {
  const user: any = await userModel.findByUserId(userId);
  const currentExp: number = parseInt(user.userExp);
  const nowExp: number = currentExp + score;
  let updateExp: number = 0;
  let updateLevel: number = 0;
  let updateLevelResult = false;

  console.log(score);
  console.log(nowExp);

  if (nowExp >= 100) {
    // 레벨
    updateLevel = nowExp / 100;
    updateLevel = user.userLevel + updateLevel;
    // 경험치
    updateExp = nowExp % 100;
    updateLevelResult = await userModel.updateLevel(userId, updateLevel);
  } else {
    updateExp = nowExp;
  }

  console.log(updateExp);

  // 경험치 업데이트
  const updateExpResult = await userModel.updateExp(userId, updateExp);

  if (updateLevelResult && updateExpResult) {
    return "all";
  } else if (updateLevelResult === false && updateExpResult === true) {
    return "exp";
  } else {
    return "error";
  }
}

export async function updateUserCharacter(userId: string) {
  const user: any = await userModel.findByUserId(userId);
  let data;
  if (user.userLevel >= 1 && user.userLevel <= 10) {
    if (user.ch_idx !== 1) {
      data = await userModel.updateCharacter(userId, 1);
    }
  }
  if (user.userLevel >= 11 && user.userLevel <= 20) {
    if (user.ch_idx !== 2) {
      data = await userModel.updateCharacter(userId, 2);
    }
  }
  if (user.userLevel >= 21 && user.userLevel <= 30) {
    if (user.ch_idx !== 3) {
      data = await userModel.updateCharacter(userId, 3);
    }
  }
  if (user.userLevel >= 31 && user.userLevel <= 40) {
    if (user.ch_idx !== 4) {
      data = await userModel.updateCharacter(userId, 4);
    }
  }
  if (user.userLevel >= 41) {
    if (user.ch_idx !== 5) {
      data = await userModel.updateCharacter(userId, 5);
    }
  }
}
