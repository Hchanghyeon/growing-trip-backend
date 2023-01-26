export interface spot {
  contentsid: string;
  contentsvalue: string;
  contentslabel: string;
  title: string;
  address: string;
  roadaddress: string;
  tag: Array<string>;
  review: Array<object>;
  introduction: string;
  latitude: number;
  longitude: number;
  phoneno: string;
  photoid: number;
  imgpath: string;
  thumbnailpath: string;
  likeNum: number;
  starNum: number;
  landmark: boolean;
}
