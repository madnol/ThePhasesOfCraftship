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
exports.UserIdentityService = void 0;
const usersExceptions_1 = require("../usersExceptions");
const userDetails_1 = require("../domain/userDetails");
const src_1 = require("@dddforum/errors/src");
class UserIdentityService {
    constructor(identityServiceAPI) {
        this.identityServiceAPI = identityServiceAPI;
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.identityServiceAPI.getUserById(userId);
                if (user) {
                    return user;
                }
                return new src_1.ApplicationErrors.NotFoundError('user');
            }
            catch (err) {
                console.log(err);
                throw new Error('error occurreted getting user from service');
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaUser = yield this.identityServiceAPI.findUserByEmail(email);
            if (!prismaUser) {
                throw new usersExceptions_1.UserNotFoundException(email);
            }
            return prismaUser;
        });
    }
    getUserDetailsByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield this.identityServiceAPI.findUserByEmail(email);
            if (!userModel) {
                throw new usersExceptions_1.UserNotFoundException(email);
            }
            return userDetails_1.UserDetails.toDTO(userModel);
        });
    }
}
exports.UserIdentityService = UserIdentityService;
