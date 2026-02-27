"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserCommand = void 0;
const exceptions_1 = require("@dddforum/backend/src/shared/exceptions");
const parser_1 = require("@dddforum/backend/src/shared/utils/parser");
class CreateUserCommand {
    constructor(props) {
        this.props = props;
    }
    static fromRequest(body) {
        const requiredKeys = ["email", "firstName", "lastName", "username"];
        const isRequestInvalid = !body || typeof body !== "object" || (0, parser_1.isMissingKeys)(body, requiredKeys);
        if (isRequestInvalid) {
            throw new exceptions_1.InvalidRequestBodyError(requiredKeys);
        }
        const input = body;
        return CreateUserCommand.fromProps(input);
    }
    static fromProps(props) {
        const isEmailValid = props.email.indexOf("@") !== -1;
        const isFirstNameValid = (0, parser_1.isBetweenLength)(props.firstName, 2, 16);
        const isLastNameValid = (0, parser_1.isBetweenLength)(props.lastName, 2, 25);
        const isUsernameValid = (0, parser_1.isBetweenLength)(props.username, 2, 25);
        if (!isEmailValid ||
            !isFirstNameValid ||
            !isLastNameValid ||
            !isUsernameValid) {
            throw new exceptions_1.InvalidParamsError();
        }
        const { username, email, firstName, lastName } = props;
        return new CreateUserCommand({ email, firstName, lastName, username });
    }
    get email() {
        return this.props.email;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    get username() {
        return this.props.username;
    }
}
exports.CreateUserCommand = CreateUserCommand;
