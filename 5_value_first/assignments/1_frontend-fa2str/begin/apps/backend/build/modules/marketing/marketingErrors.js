"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketingErrorHandler = marketingErrorHandler;
const src_1 = require("@dddforum/errors/src");
function marketingErrorHandler(error, _, res, _next) {
    let responseBody;
    if (error.type === "InvalidRequestBodyError") {
        responseBody = {
            success: false,
            data: null,
            error: {
                message: error.message,
                code: new src_1.ApplicationErrors.ValidationError(error.message),
            },
        };
        return res.status(400).json(responseBody);
    }
    responseBody = {
        success: false,
        data: null,
        error: {
            code: new src_1.ServerErrors.ServerErrorException(),
        },
    };
    return res.status(500).json(responseBody);
}
