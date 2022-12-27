"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.getUserData = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUserData = (user) => {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
    };
};
exports.getUserData = getUserData;
const generateToken = (data) => {
    const { user, time, key } = data;
    const accessToken = jsonwebtoken_1.default.sign({
        UserInfo: {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            image: user.image,
        },
    }, key || '', { expiresIn: time });
    return accessToken;
};
exports.generateToken = generateToken;
