"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("./routes/users"));
const spots_1 = __importDefault(require("./routes/spots"));
const assay_1 = __importDefault(require("./routes/assay"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mysql_js_1 = require("./db/mysql.js");
const mongoose_js_1 = require("./db/mongoose.js");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const httpPort = 3002;
const httpsPort = 3001;
const corsOptions = {
    origin: "*",
    credentials: true,
};
app.use((0, express_fileupload_1.default)());
app.use((0, cors_1.default)(corsOptions)); // cors 라이브러리
app.use(express_1.default.urlencoded({ extended: false })); // body Parsing
app.use(express_1.default.json()); // Json Parsing
app.use((0, cookie_parser_1.default)()); // Cookie Parsing
app.use((0, morgan_1.default)('tiny')); // Request Log Check
app.use(express_1.default.static('src/public')); // public directory setting
app.get("/", (req, res) => {
    res.status(200).json({ status: '요청성공' });
});
app.use("/user", users_1.default); // user관련 Route
app.use("/spot", spots_1.default); // user관련 Route
app.use("/assay", assay_1.default); // user관련 Route
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
mysql_js_1.sequelize.sync().then(() => {
    console.log("SuccessFully connected to mysql");
});
(0, mongoose_js_1.connectDB)()
    .then(() => {
    console.log("SuccessFully connected to mongodb");
})
    .catch((e) => console.error(e));
app.listen(httpPort, () => {
    console.log(`server is running`);
});
const options = {
    key: fs_1.default.readFileSync('./growtKey/key.pem'),
    cert: fs_1.default.readFileSync('./growtKey/crt.pem'),
};
https_1.default.createServer(options, app).listen(httpsPort);
