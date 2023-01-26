export interface user {
  userId: string;
  userPw: string;
  userName: string;
  userMail: string;
  userBirth: string;
  userGender: string;
  userAddr1: string;
  userAddr2: string;
  regDate: Date;
  imgSrc: string;
  userLevel: number;
  ch_idx: number;
  userExp: number;
}

export interface character {
  ch_idx: number;
  level: number;
  ch_image: string;
  ch_name: string;
}
