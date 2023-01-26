export interface fileOptions {
    ca : Buffer,
    key : Buffer,
    cert : Buffer,
    minVersion : string,
};

export interface envConfig {
    jwt: {
        secretKey : string,
        expiresInSec: string,
      },
      bcrypt: {
        saltRounds : string,
      },
      db: {
        host: string,
        user: string,
        database: string,
        password: string,
        port: string,
      },
      mdb: {
        host: string,
      },
      kakao: {
        key: string,
        redirectUrl:string
      },
      LOG_DIR:string 
}

export class customError extends Error {
  name!: string;
  message!: string;
  stack?: string;
  status!:number;
}
