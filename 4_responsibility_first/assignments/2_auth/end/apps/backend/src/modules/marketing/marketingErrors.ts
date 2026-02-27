import { Request, Response, NextFunction } from "express";
import { ServerErrors } from "@dddforum/errors/server";
import { ApplicationErrors } from "@dddforum/errors/application";
import { API } from '@dddforum/api/marketing'
import { CustomError } from "@dddforum/errors/custom";

export function marketingErrorHandler(
  error: CustomError,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<API.AnyMarketingAPIResponse> {

  if (error.name === "InvalidRequestBodyError") {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: error.message,
        code: new ApplicationErrors.ValidationError(error.message),
      },
    });
  }

  return res.status(500).json({
    success: false,
    data: null,
    error: {
      code: new ServerErrors.GenericServerError(),
    },
  });
}
