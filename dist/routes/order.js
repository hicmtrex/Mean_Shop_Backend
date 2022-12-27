"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = require("../controllers/order");
const protecte_routes_1 = require("../middleware/protecte-routes");
const router = express_1.default.Router();
router.route('/').post(protecte_routes_1.auth, order_1.createOrder).get(protecte_routes_1.auth, protecte_routes_1.admin, order_1.getAllOrders);
router.route('/payment').post(protecte_routes_1.auth, order_1.orderPayment);
router.route('/user').get(protecte_routes_1.auth, order_1.getUserOrders);
router
    .route('/:id')
    .get(protecte_routes_1.auth, order_1.getOrderById)
    .put(protecte_routes_1.auth, order_1.updateOrder)
    .delete(protecte_routes_1.auth, order_1.deleteOrder);
exports.default = router;
