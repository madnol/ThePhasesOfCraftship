"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsErrorHandler = postsErrorHandler;
function postsErrorHandler(error, _, res, _next) {
    switch (error.name) {
        case "PermissionError":
            return res.status(403).json({
                success: false,
                data: undefined,
                error: {
                    code: error.name,
                    message: error.message,
                }
            });
        case "ValidationError":
            return res.status(400).json({
                success: false,
                data: undefined,
                error: {
                    code: error.name,
                    message: error.message,
                }
            });
        case 'ServerError':
        default:
            return res.status(500).json({
                success: false,
                data: undefined,
                error: {
                    code: error.name,
                    message: error.message,
                }
            });
    }
}
