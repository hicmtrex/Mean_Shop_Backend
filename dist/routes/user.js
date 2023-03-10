"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const protecte_routes_1 = require("../middleware/protecte-routes");
const router = express_1.default.Router();
router.route('/').get(protecte_routes_1.auth, protecte_routes_1.admin, user_1.getAllUsers);
router
    .route('/:id')
    .delete(protecte_routes_1.auth, protecte_routes_1.admin, user_1.deleteUser)
    .put(protecte_routes_1.auth, user_1.updateUser)
    .get(protecte_routes_1.auth, user_1.getUserById);
exports.default = router;
