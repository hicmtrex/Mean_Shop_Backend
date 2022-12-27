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
exports.refreshToken = exports.userLogin = exports.userRegister = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../utils/token");
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.userRegister = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, address, password } = req.body;
    const exist = yield user_1.default.findOne({ email });
    if (exist) {
        res.status(422).json({ message: 'email already used!' });
        return;
    }
    const user = yield user_1.default.create({
        username,
        email,
        password,
    });
    if (user) {
        const tokenData = {
            user: (0, token_1.getUserData)(user),
            key: process.env.ACCESS_TOKEN_SECRET || '',
            time: '2h',
        };
        const refreshData = {
            user: (0, token_1.getUserData)(user),
            key: process.env.REFRESH_TOKEN_SECRET || '',
            time: '2d',
        };
        const accessToken = (0, token_1.generateToken)(tokenData);
        const refreshToken = (0, token_1.generateToken)(refreshData);
        res.cookie('token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
        });
        res.status(201).json({ token: accessToken });
    }
}));
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.userLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        res.status(404).json({ message: 'Email not exist' });
        return;
    }
    const match = yield bcryptjs_1.default.compare(password, user.password);
    if (match) {
        const tokenData = {
            user: (0, token_1.getUserData)(user),
            key: process.env.ACCESS_TOKEN_SECRET || '',
            time: '2h',
        };
        const refreshData = {
            user: (0, token_1.getUserData)(user),
            key: process.env.REFRESH_TOKEN_SECRET || '',
            time: '2d',
        };
        const accessToken = (0, token_1.generateToken)(tokenData);
        const refreshToken = (0, token_1.generateToken)(refreshData);
        res.cookie('token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
        });
        res.status(200).json({ token: accessToken });
    }
    else {
        res.status(401).json({ message: ' wrong email or password' });
        return;
    }
}));
// @desc    refresh user token
// @route   POST /api/auth/refresh-token
// @access  Private/Cookies
exports.refreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies.token) {
        res.status(401).json({ message: 'Unauthorized no token!' });
        return;
    }
    const refreshToken = cookies.token;
    const decode = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '');
    const tokenData = {
        user: decode.UserInfo,
        key: process.env.ACCESS_TOKEN_SECRET || '',
        time: '2h',
    };
    const accessToken = (0, token_1.generateToken)(tokenData);
    res.status(200).json({
        token: accessToken,
    });
}));
