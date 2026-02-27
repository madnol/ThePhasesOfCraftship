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
exports.CreateMember = exports.UserIdentityNotFound = exports.MemberUsernameTaken = void 0;
const src_1 = require("@dddforum/core/src");
const member_1 = require("../../../domain/member");
const src_2 = require("@dddforum/errors/src");
// Improvement: These errors can be generalized as 'NotFound' errors, like 'MemberNotFound', 'CommentNotFound', etc.
// This way, we can have a single error type for all 'NotFound' errors.
// This is a good example of the 'Generalize Error' refactoring technique.
// TODO: Move these and generalize thm
class MemberAlreadyExistsError {
}
// TODO: Conflict type of error
class MemberUsernameTaken extends Error {
    constructor() {
        super();
        this.name = 'MemberUsernameTaken';
    }
}
exports.MemberUsernameTaken = MemberUsernameTaken;
// TODO: Not found error
class UserIdentityNotFound extends Error {
    constructor() {
        super();
        this.name = 'UserIdentityNotFound';
    }
}
exports.UserIdentityNotFound = UserIdentityNotFound;
class CreateMember {
    constructor(memberRepository) {
        this.memberRepository = memberRepository;
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, userId } = request.props;
            let existingMember = null;
            // Check if user already exists; if they do, then we will just return 
            // them and not do anything else. All good.
            existingMember = yield this.memberRepository.getMemberByUserId(userId);
            if (existingMember) {
                return (0, src_1.success)(existingMember);
            }
            // Check if username is taken
            existingMember = yield this.memberRepository.findUserByUsername(username);
            if (existingMember) {
                return (0, src_1.fail)(new MemberUsernameTaken());
            }
            // Create member
            const memberOrError = member_1.Member.create({
                username,
                userId,
            });
            if (memberOrError instanceof src_2.ApplicationErrors.ValidationError) {
                return (0, src_1.fail)(memberOrError);
            }
            // Save member
            yield this.memberRepository.saveAggregateAndEvents(memberOrError, memberOrError.getDomainEvents());
            return (0, src_1.success)(memberOrError);
        });
    }
}
exports.CreateMember = CreateMember;
