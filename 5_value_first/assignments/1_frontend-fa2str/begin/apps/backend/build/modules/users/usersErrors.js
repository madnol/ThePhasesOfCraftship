"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userErrorHandler = userErrorHandler;
const src_1 = require("@dddforum/errors/src");
const usersExceptions_1 = require("./usersExceptions");
// Todo: refactor all of these to use the new error handling system
function userErrorHandler(error, _, res, _next) {
    let responseBody;
    if (error.type === "InvalidRequestBodyError" ||
        error.type === "InvalidParamsError") {
        responseBody = {
            success: false,
            data: null,
            error: {
                message: error.message,
                code: new src_1.ApplicationErrors.ValidationError(error.message)
            },
        };
        return res.status(400).json(responseBody);
    }
    if (error.type === "UsernameAlreadyTakenException") {
        responseBody = {
            success: false,
            data: null,
            error: {
                code: new usersExceptions_1.UsernameAlreadyTakenException(error.message)
            },
        };
        return res.status(409).json(responseBody);
    }
    if (error.type === "EmailAlreadyInUseException") {
        responseBody = {
            success: false,
            data: null,
            error: {
                code: new usersExceptions_1.EmailAlreadyInUseException(error.message)
            },
        };
        return res.status(409).json(responseBody);
    }
    if (error.type === "UserNotFoundException") {
        responseBody = {
            success: false,
            data: null,
            error: {
                code: new usersExceptions_1.UserNotFoundException(error.message)
            },
        };
        return res.status(404).json(responseBody);
    }
    responseBody = {
        success: false,
        data: null,
        error: {
            code: new src_1.ServerErrors.ServerErrorException(error.message)
        },
    };
    return res.status(500).json(responseBody);
}
