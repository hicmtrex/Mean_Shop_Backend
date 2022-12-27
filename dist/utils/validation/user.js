"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const express_validator_1 = require("express-validator");
exports.registerSchema = [
    (0, express_validator_1.body)('username').isLength({ min: 4, max: 20 }).isString(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6, max: 50 }).isString(),
];
exports.loginSchema = [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6, max: 50 }).isString(),
];
