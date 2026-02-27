"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundException = exports.UsernameAlreadyTakenException = exports.EmailAlreadyInUseException = void 0;
const src_1 = require("@dddforum/errors/src");
// TODO: Oh, this is where you can override the errors and return more specific errors
// TODO: set it up so that you can do this in each of the classes, because that's pretty cool.
class EmailAlreadyInUseException extends src_1.ApplicationErrors.ConflictError {
    constructor(email) {
        super('user', `Email ${email} is already in use`);
    }
}
exports.EmailAlreadyInUseException = EmailAlreadyInUseException;
// TODO: Move these to members
class UsernameAlreadyTakenException extends src_1.ApplicationErrors.ConflictError {
    constructor(username) {
        super('user', `Username ${username} is already taken`);
    }
}
exports.UsernameAlreadyTakenException = UsernameAlreadyTakenException;
class UserNotFoundException extends src_1.ApplicationErrors.NotFoundError {
    constructor(email) {
        super('user', `User with email ${email} not found`);
    }
}
exports.UserNotFoundException = UserNotFoundException;
