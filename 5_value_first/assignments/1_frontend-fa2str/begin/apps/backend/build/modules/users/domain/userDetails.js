"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetails = void 0;
// import { User as PrismaUserModel } from "@prisma/client"
class UserDetails {
    // TODO: Come back to this
    static toDTO(model) {
        return {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            roles: []
        };
    }
}
exports.UserDetails = UserDetails;
