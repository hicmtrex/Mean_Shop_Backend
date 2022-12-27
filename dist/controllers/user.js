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
exports.updateUser = exports.deleteUser = exports.getUserById = exports.getAllUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_1 = __importDefault(require("../models/user"));
// @desc    get all users
// @route   Get /api/users
// @access  Private/Admin
exports.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.query.pageSize || 9;
    const page = req.query.page || 1;
    const searchQuery = req.query.query || '';
    const queryFilter = searchQuery && searchQuery !== 'all'
        ? {
            username: {
                $regex: searchQuery,
                $options: 'i',
            },
        }
        : {};
    const users = yield user_1.default.find(Object.assign({}, queryFilter))
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean()
        .select('-password');
    const countUser = yield user_1.default.countDocuments(Object.assign({}, queryFilter));
    if (users) {
        res.status(200).json({
            countUser,
            users,
            page,
            pages: Math.ceil(countUser / pageSize),
        });
    }
    else {
        res.status(404).json({ message: 'users not found!' });
    }
}));
// @desc    get all users
// @route   Get /api/users/:id
// @access  Private
exports.getUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.params.id);
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ message: 'user not found!' });
    }
}));
// @desc    Delete user
// @route   Delete /api/users/:id
// @access  Private/Admin
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.params.id);
    if (user) {
        yield user.remove();
        res.status(200).json('user has been deleted');
    }
    else {
        res.status(404).json({ message: 'user not found!' });
    }
}));
// @desc    Update user
// @route   Put /api/users/:id
// @access  Private
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const user = yield user_1.default.findById(req.params.id);
    if (user) {
        user.username = username;
        user.email = email;
        if (password)
            user.password = password;
        const updatedUser = yield user.save();
        res.status(200).json(updatedUser);
    }
    else {
        res.status(404).json({ message: 'user not found!' });
    }
}));
