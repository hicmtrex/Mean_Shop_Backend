"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
const user_1 = __importDefault(require("./user"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/products', product_1.default);
router.use('/orders', order_1.default);
router.use('/users', user_1.default);
exports.default = router;
