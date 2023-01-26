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
exports.getUserExpData = exports.addExpData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const expSchema = new Schema({
    userId: { type: String },
    category: { type: String },
    score: { type: Number },
    likeId: { type: String },
    time: { type: String },
}, {
    versionKey: false,
});
const exp = mongoose_1.default.model("exp", expSchema, "exp");
function addExpData(expData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exp.insertMany(expData);
    });
}
exports.addExpData = addExpData;
function getUserExpData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exp.find({ userId });
    });
}
exports.getUserExpData = getUserExpData;
