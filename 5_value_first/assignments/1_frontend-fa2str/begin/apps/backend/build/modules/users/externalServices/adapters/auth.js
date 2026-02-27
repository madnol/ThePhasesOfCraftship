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
exports.createJwtCheck = createJwtCheck;
const firebase_admin_1 = require("firebase-admin");
function createJwtCheck(config) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = yield (0, firebase_admin_1.auth)().verifyIdToken(token);
            req.user = decodedToken;
            next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    });
}
