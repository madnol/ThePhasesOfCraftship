"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const express_1 = require("express");
class UsersController {
    constructor(config, errorHandler) {
        this.errorHandler = errorHandler;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
        this.setupErrorHandler();
    }
    getRouter() {
        return this.router;
    }
    setupRoutes() {
        // this.router.get("/authenticate", this.authorize.bind(this));
    }
    setupErrorHandler() {
        this.router.use(this.errorHandler);
    }
}
exports.UsersController = UsersController;
