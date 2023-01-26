import { config } from "../config/config.js";
import axios from "axios";

const { key, redirectUrl } = config.kakao;

export async function getAccessToken(token:any) {
  const requestUrl =
    "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=" +
    key +
    "&redirect_uri=" +
    redirectUrl +
    "&code=" +
    token;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const tokenInfo:any = await axios.post(requestUrl, {
    headers,
  });
  return await tokenInfo.json();
  /* 반환 값 정보
  {
    access_token: 'Lnfp_qNDAV0pG30UZejW8OiwaQ49nh8phQjHdbIbCj1ymAAAAYELPNQG',
    token_type: 'bearer',
    refresh_token: '6_tphsHvdCiWRX1l9kim3lMDiJpC1nYgyISJzyZICj1ymAAAAYELPNQE',
    expires_in: 7199,
    scope: 'birthday account_email profile_image gender profile_nickname',
    refresh_token_expires_in: 5183999
  } */
}

export async function getKakaoUserInfo(tokenInfo:any) {
  const requestUrl = "https://kapi.kakao.com/v2/user/me";
  const headers = {
    Authorization: `Bearer ${tokenInfo.access_token}`,
  };

  const kakaoUserInfo :any = await axios.get(requestUrl, {
    headers,
  });
  return await kakaoUserInfo.json();
}

export async function xyAddress(address:any) {
  const requestUrl = "https://dapi.kakao.com/v2/local/search/address.json?query="+address;
  const headers = {
    "Authorization": `KakaoAK ${key}`,
  };

  let kakaoAddr:any = await axios.get(requestUrl, {
    headers,
  });

  const arr = {
    x : kakaoAddr.data.documents[0].x,
    y : kakaoAddr.data.documents[0].y,
  }
  
  return arr;
}
