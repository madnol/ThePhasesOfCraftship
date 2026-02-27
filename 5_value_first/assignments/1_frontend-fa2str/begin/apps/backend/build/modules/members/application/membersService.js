"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const createMember_1 = require("./useCases/createMember/createMember");
class MemberService {
    constructor(membersRepository) {
        this.membersRepository = membersRepository;
    }
    createMember(command) {
        return new createMember_1.CreateMember(this.membersRepository).execute(command);
    }
}
exports.MemberService = MemberService;
