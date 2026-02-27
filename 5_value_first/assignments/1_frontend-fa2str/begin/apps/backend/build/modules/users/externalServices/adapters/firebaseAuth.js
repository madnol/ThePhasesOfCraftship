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
exports.FirebaseAuth = void 0;
const src_1 = require("@dddforum/errors/src");
const firebase_admin_1 = require("firebase-admin");
const path_1 = __importDefault(require("path"));
const app_1 = require("firebase-admin/app");
class FirebaseAuth {
    constructor() {
        this.initialize();
        this.firebaseAuth = (0, firebase_admin_1.auth)();
    }
    initialize() {
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)(require(path_1.default.join(__dirname, '../../../../../service-key.json')))
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRecord = yield this.firebaseAuth.getUser(userId);
                return {
                    id: userRecord.uid,
                    email: userRecord.email || '',
                    emailVerified: userRecord.emailVerified,
                    name: userRecord.displayName || ''
                };
            }
            catch (error) {
                if (error.code === 'auth/user-not-found') {
                    return new src_1.ApplicationErrors.NotFoundError('user');
                }
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRecord = yield this.firebaseAuth.getUserByEmail(email);
                return {
                    id: userRecord.uid,
                    email: userRecord.email || '',
                    emailVerified: userRecord.emailVerified,
                    name: userRecord.displayName || ''
                };
            }
            catch (error) {
                if (error.code === 'auth/user-not-found') {
                    return new src_1.ApplicationErrors.NotFoundError('user');
                }
                throw error;
            }
        });
    }
}
exports.FirebaseAuth = FirebaseAuth;
