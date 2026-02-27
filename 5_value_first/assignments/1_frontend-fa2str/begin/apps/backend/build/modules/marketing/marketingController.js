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
exports.MarketingController = void 0;
const express_1 = __importDefault(require("express"));
class MarketingController {
    constructor(marketingService, errorHandler) {
        this.marketingService = marketingService;
        this.errorHandler = errorHandler;
        this.router = express_1.default.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }
    getRouter() {
        return this.router;
    }
    setupRoutes() {
        this.router.post("/new", this.addEmailToList.bind(this));
    }
    setupErrorHandler() {
        this.router.use(this.errorHandler);
    }
    addEmailToList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const result = yield this.marketingService.addEmailToList(email);
                const response = {
                    success: true,
                    data: result,
                    error: {},
                };
                return res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MarketingController = MarketingController;
