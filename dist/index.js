"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = __importDefault(require("./lib/db"));
const path_1 = __importDefault(require("path"));
const error_1 = require("./middleware/error");
dotenv_1.default.config();
//database
(0, db_1.default)();
// Boot express
const app = (0, express_1.default)();
//express middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:4200', 'https://mean-shop.vercel.app'],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
//routes
app.use('/api', routes_1.default);
//default view templet
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'views', 'index.html'));
});
//costom middlewares
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
