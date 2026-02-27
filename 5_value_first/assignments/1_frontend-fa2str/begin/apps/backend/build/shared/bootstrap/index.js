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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const compositionRoot_1 = require("../compositionRoot");
const config_1 = require("../config");
const config = new config_1.Config("start");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const composition = compositionRoot_1.CompositionRoot.createCompositionRoot(config);
        return composition.start();
    });
}
// const webServer = composition.getWebServer();
// const dbConnection = composition.getDatabase();
// export const app = webServer.getApplication();
// export const database = dbConnection;
