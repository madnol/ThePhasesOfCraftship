
import { Request, Response, NextFunction } from "express";
import { API } from '@dddforum/api/members'
import { ApplicationErrors } from "@dddforum/errors/application";
import { CustomError } from "@dddforum/errors/custom";

export function membersErrorHandler(
  error: CustomError,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<API.AnyMemberAPIResponse> { // Updated return type

  const errorType = (error as ApplicationErrors.AnyApplicationError).type

  switch (errorType) {
    case "PermissionError":
      return res.status(403).json({
        success: false,
        data: undefined,
        error: {
          code: 403,
          message: error.message,
        }
      });
    case "ValidationError":
      return res.status(400).json({
        success: false,
        data: undefined,
        error: {
          code: 400,
          message: error.message,
        }
      });
    case 'GenericServerError':
    default:
      return res.status(500).json({
        success: false,
        data: undefined,
        error: {
          code: 500,
          message: error.message,
        }
      });
  }
}
