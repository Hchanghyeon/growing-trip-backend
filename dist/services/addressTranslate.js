"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xyAddress = exports.getKakaoUserInfo = exports.getAccessToken = void 0;
const config_js_1 = require("../config/config.js");
const axios_1 = __importDefault(require("axios"));
const { key, redirectUrl } = config_js_1.config.kakao;
function getAccessToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestUrl = "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=" +
            key +
            "&redirect_uri=" +
            redirectUrl +
            "&code=" +
            token;
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        const tokenInfo = yield axios_1.default.post(requestUrl, {
            headers,
        });
        return yield tokenInfo.json();
        /* 반환 값 정보
        {
          access_token: 'Lnfp_qNDAV0pG30UZejW8OiwaQ49nh8phQjHdbIbCj1ymAAAAYELPNQG',
          token_type: 'bearer',
          refresh_token: '6_tphsHvdCiWRX1l9kim3lMDiJpC1nYgyISJzyZICj1ymAAAAYELPNQE',
          expires_in: 7199,
          scope: 'birthday account_email profile_image gender profile_nickname',
          refresh_token_expires_in: 5183999
        } */
    });
}
exports.getAccessToken = getAccessToken;
function getKakaoUserInfo(tokenInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestUrl = "https://kapi.kakao.com/v2/user/me";
        const headers = {
            Authorization: `Bearer ${tokenInfo.access_token}`,
        };
        const kakaoUserInfo = yield axios_1.default.get(requestUrl, {
            headers,
        });
        return yield kakaoUserInfo.json();
    });
}
exports.getKakaoUserInfo = getKakaoUserInfo;
function xyAddress(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestUrl = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address;
        const headers = {
            "Authorization": `KakaoAK ${key}`,
        };
        let kakaoAddr = yield axios_1.default.get(requestUrl, {
            headers,
        });
        const arr = {
            x: kakaoAddr.data.documents[0].x,
            y: kakaoAddr.data.documents[0].y,
        };
        return arr;
    });
}
exports.xyAddress = xyAddress;
