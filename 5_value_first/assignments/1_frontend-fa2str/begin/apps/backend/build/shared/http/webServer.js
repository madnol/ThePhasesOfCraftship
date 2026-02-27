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
exports.WebServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const processService_1 = require("../processes/processService");
class WebServer {
    constructor(config) {
        this.config = config;
        this.state = "stopped";
        this.express = (0, express_1.default)();
        this.initializeServer();
    }
    initializeServer() {
        this.addMiddlewares();
        this.express.use((0, cors_1.default)());
    }
    addMiddlewares() {
        this.express.use(express_1.default.json());
    }
    mountRouter(path, router) {
        this.express.use(path, router);
    }
    getApplication() {
        return this.express;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _reject) => {
                processService_1.ProcessService.killProcessOnPort(this.config.port, () => {
                    if (this.config.env === "test") {
                        resolve();
                    }
                    console.log("Starting the server");
                    this.instance = this.express.listen(this.config.port, () => {
                        console.log(`Server is running on port ${this.config.port}`);
                        this.state = "started";
                        resolve();
                    });
                });
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!this.instance)
                    return reject("Server not started");
                this.instance.close((err) => {
                    if (err)
                        return reject("Error stopping the server");
                    this.state = "stopped";
                    return resolve("Server stopped");
                });
            });
        });
    }
    isStarted() {
        return this.state === "started";
    }
}
exports.WebServer = WebServer;
