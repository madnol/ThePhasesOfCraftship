"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMemberCommand = void 0;
const src_1 = require("@dddforum/errors/src");
class CreateMemberCommand {
    constructor(props) {
        this.props = props;
    }
    static create(token, body) {
        if (!(token === null || token === void 0 ? void 0 : token.email)) {
            throw new src_1.ServerErrors.MissingRequestParamsException(["email"]);
        }
        if (!(token === null || token === void 0 ? void 0 : token.uid)) {
            throw new src_1.ServerErrors.MissingRequestParamsException(["userId"]);
        }
        if (!body.username) {
            throw new src_1.ServerErrors.MissingRequestParamsException(["username"]);
        }
        return new CreateMemberCommand({
            userId: token.uid,
            username: body.username,
            email: token.email
        });
    }
}
exports.CreateMemberCommand = CreateMemberCommand;
