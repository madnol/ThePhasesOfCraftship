"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostCommand = void 0;
const exceptions_1 = require("../../shared/exceptions");
class CreatePostCommand {
    constructor(props) {
        this.props = props;
    }
    static fromRequest(body) {
        const { title, postType, memberId } = body;
        if (!memberId) {
            throw new exceptions_1.MissingRequestParamsException(["memberId"]);
        }
        if (!title) {
            throw new exceptions_1.MissingRequestParamsException(["title"]);
        }
        if (!postType) {
            throw new exceptions_1.MissingRequestParamsException(["postType"]);
        }
        return new CreatePostCommand(Object.assign({}, body));
    }
}
exports.CreatePostCommand = CreatePostCommand;
