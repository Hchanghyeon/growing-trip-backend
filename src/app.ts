import express, {Request, Response, NextFunction} from "express";
import morgan from "morgan";
import usersRoute from "./routes/users";
import spotsRoute from "./routes/spots";
import assayRoute from "./routes/assay";
import cookieParser from "cookie-parser";
import cors from "cors";
import { sequelize } from "./db/mysql.js";
import { connectDB } from "./db/mongoose.js";
import { customError } from "./interfaces/util";
import fileUpload from "express-fileupload";
import https from "https";
import fs from "fs";


const app: express.Application = express();
const httpPort: number = 3002;
const httpsPort: number = 3001;

const corsOptions = {
  origin: "*",
  credentials: true,
};


app.use(fileUpload());
app.use(cors(corsOptions)); // cors 라이브러리
app.use(express.urlencoded({ extended: false })); // body Parsing
app.use(express.json()); // Json Parsing
app.use(cookieParser()); // Cookie Parsing
app.use(morgan('tiny')); // Request Log Check
app.use(express.static('src/public')); // public directory setting


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({status:'요청성공'});
});
app.use("/user",usersRoute); // user관련 Route
app.use("/spot",spotsRoute); // user관련 Route
app.use("/assay",assayRoute); // user관련 Route


 /* 에러처리
 app.use((req, res, next) => {
  let err:customError = new customError("Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});
*/

// mysql
sequelize.sync().then(() => {
  console.log("SuccessFully connected to mysql");
});

connectDB()
  .then(() => {
    console.log("SuccessFully connected to mongodb");
  })
  .catch((e) => console.error(e));


app.listen(httpPort, () => {
  console.log(`server is running`);
});

const options:any = {
  key : fs.readFileSync('./growtKey/key.pem'),
  cert: fs.readFileSync('./growtKey/crt.pem'),
}

https.createServer(options,app).listen(httpsPort);