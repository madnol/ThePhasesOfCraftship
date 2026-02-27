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
exports.MembersController = void 0;
const express_1 = __importDefault(require("express"));
const memberCommands_1 = require("./memberCommands");
const auth_1 = require("../users/externalServices/adapters/auth");
class MembersController {
    constructor(memberService, errorHandler, config) {
        this.memberService = memberService;
        this.errorHandler = errorHandler;
        this.config = config;
        this.router = express_1.default.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }
    getRouter() {
        return this.router;
    }
    setupRoutes() {
        let jwtCheck = (0, auth_1.createJwtCheck)(this.config);
        this.router.post("/new", jwtCheck, this.createMember.bind(this));
    }
    createMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = memberCommands_1.CreateMemberCommand.create(req.user, req.body);
                const result = yield this.memberService.createMember(command);
                if (result.isSuccess()) {
                    return res.status(200).json({
                        success: true,
                        data: result.getValue().toDTO(),
                    });
                }
                else {
                    return res.status(400).json({
                        success: false,
                        error: result.getError()
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    setupErrorHandler() {
        this.router.use(this.errorHandler);
    }
}
exports.MembersController = MembersController;
