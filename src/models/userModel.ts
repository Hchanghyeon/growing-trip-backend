import { sequelize } from "../db/mysql.js";
import { DataTypes, Model } from "sequelize";
import { user, character } from "../interfaces/userDto.js";

// 유저모델
export class Users extends Model<user> {
  public userId!: string;
  public userPw!: string;
  public userName!: string;
  public userMail!: string;
  public userBirth!: string;
  public userGender!: string;
  public userAddr1!: string;
  public userAddr2!: string;
  public regDate!: Date;
  public imgSrc!: string;
  public userLevel!: number;
  public ch_idx!: number;
  public userExp!: number;
}

// 캐릭터 모델
export class Character extends Model<character> {
  public ch_idx!: number;
  public level!: number;
  public ch_image!: string;
  public ch_name!: string;
}

// ** Associate 설정

Users.init(
  {
    userId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    userPw: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    userMail: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userBirth: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    userGender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    userAddr1: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userAddr2: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    regDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    imgSrc: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    userLevel: {
      type: DataTypes.INTEGER,
    },
    ch_idx: {
      type: DataTypes.INTEGER,
    },
    userExp: {
      type: DataTypes.INTEGER,
    },
  },
  { modelName: "Users", tableName: "users", sequelize, timestamps: false }
);

Character.init(
  {
    ch_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ch_image: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    ch_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    modelName: "Character",
    tableName: "character",
    sequelize,
    timestamps: false,
  }
);

Users.belongsTo(Character, { foreignKey: "ch_idx", targetKey: "ch_idx" });

// ** 유저 생성
export async function createUser(user: user): Promise<boolean> {
  return Users.create(user)
    .then((data) => {
      console.log(`SucessFully Create User ${user.userId}`);
      console.log(data);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// ** 유저 레벨 추가하기
export async function addUserLevel(
  userId: string,
  level: number
): Promise<boolean> {
  return Users.increment({ userLevel: level }, { where: { userId: userId } })
    .then((data) => {
      console.log(" userLevel add Success ");
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

// ** 유저 아이디 중복체크
export async function userIdCheck(userId: string): Promise<boolean> {
  return Users.findOne({ where: { userId } })
    .then((data) => {
      if (data) {
        console.log(`This user is in Database ${userId}`);
        return true;
      } else {
        console.log(`This user isn't in Database ${userId}`);
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// ** 아이로 유저정보 가져오기
export async function findByUserId(userId: string): Promise<any> {
  return Users.findOne({
    where: { userId },
    include: [
      {
        model: Character,
      },
    ],
  })
    .then((user) => {
      if (user) {
        console.log(`This user is in Database ${userId}`);
        return user;
      } else {
        console.log(`This user isn't in Database ${userId}`);
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// ** 전체 유저리스트 가져오기
export async function getUserList() {
  return Users.findAll({
    include: [
      {
        model: Character,
      },
    ],
  });
}


// import { db } from "../db/mysql.js";

/* 유저 생성 
export async function createUser(user) {
  return db
    .execute("insert into users (userId, userPw, userName, userMail, userAddr1, userAddr2, regDate) values (?,?,?,?,?,?,?,?)", user)
    .then((result) => console.log(`${result} 등록됨`));
}

// 모든 유저 가져오기
export async function getUser() {
  return db
    .execute("select * from users")
    .then((result) => {return result[0]});
}
*/
// ** 캐릭터 업데이트
export async function updateExp(userId: string, score: number) {
  return Users.update({ userExp: score }, { where: { userId } })
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// ** 캐릭터 업데이트
export async function updateLevel(userId: string, level: number) {
  return Users.update({ userLevel: level }, { where: { userId } })
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// ** 캐릭터 업데이트
export async function updateCharacter(userId: string, ch_idx: number) {
  return Users.update({ ch_idx: ch_idx }, { where: { userId: userId } })
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}