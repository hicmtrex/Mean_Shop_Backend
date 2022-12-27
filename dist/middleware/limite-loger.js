"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 3000 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts from this IP, please try again after 5min',
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
exports.default = loginLimiter;
