"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controllers/product");
const router = express_1.default.Router();
router.route('/').get(product_1.getAllProducts).post(product_1.createProduct);
router
    .route('/:id')
    .delete(product_1.deleteProduct)
    .get(product_1.getProductByUd)
    .put(product_1.updateProduct);
exports.default = router;
