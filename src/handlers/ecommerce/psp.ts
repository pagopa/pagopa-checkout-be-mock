/* eslint-disable sonarjs/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler, Request, Response } from "express";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { logger } from "../../logger";
import {
  Version,
  createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold,
  createSuccessGetPspByPaymentMethodsIdResponseEntityUpThreshold,
  error400BadRequest,
  error404NotFound
} from "../../utils/ecommerce/psp";
import { FlowCase, getFlowCookie } from "../../flow";
import { CalculateFeeRequest } from "../../generated/ecommerce/CalculateFeeRequest";
import { CalculateFeeRequest as CalculateFeeRequestV2 } from "../../generated/ecommerce-v2/CalculateFeeRequest";

const handleCalculateFeeResponseBody = (
  req: Request,
  res: Response,
  version: Version
): Response => {
  logger.info(`[Calculate fees response] - handling ${version} request`);
  switch (getFlowCookie(req)) {
    case FlowCase.FAIL_CALCULATE_FEE:
      return res.status(400).send(error400BadRequest());
    case FlowCase.NOT_FOUND_CALCULATE_FEE:
      return res.status(404).send(error404NotFound());
    case FlowCase.OK_BELOWTHRESHOLD_CALUCLATE_FEE:
      return res
        .status(200)
        .send(
          createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold(
            version
          )
        );
    case FlowCase.OK_ABOVETHRESHOLD_CALUCLATE_FEE:
      return res
        .status(200)
        .send(
          createSuccessGetPspByPaymentMethodsIdResponseEntityUpThreshold(
            version
          )
        );
    default:
      return res
        .status(200)
        .send(
          createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold(
            version
          )
        );
  }
};

export const ecommerceGetPspByPaymentMethodsV1: RequestHandler = async (
  req,
  res
) => {
  if (req.headers["x-transaction-id-from-client"] == null) {
    logger.info(
      "[Get psps by payment method id ecommerce] - Return error case invalid x-transaction-id"
    );
    return res.status(401).send();
  }
  logger.info(
    "[Get psps by payment method id ecommerce] - Return success case"
  );
  return pipe(
    req.body,
    CalculateFeeRequest.decode,
    E.fold(
      () => res.status(400).send(error400BadRequest()),
      () => handleCalculateFeeResponseBody(req, res, Version.V1)
    )
  );
};

export const ecommerceGetPspByPaymentMethodsV2: RequestHandler = async (
  req,
  res
) => {
  if (req.headers["x-transaction-id-from-client"] == null) {
    logger.info(
      "[Get psps by payment method id ecommerce] - Return error case invalid x-transaction-id"
    );
    return res.status(401).send();
  }
  logger.info(
    "[Get psps by payment method id ecommerce] - Return success case"
  );
  return pipe(
    req.body,
    CalculateFeeRequestV2.decode,
    E.fold(
      () => res.status(400).send(error400BadRequest()),
      () => handleCalculateFeeResponseBody(req, res, Version.V2)
    )
  );
};

export const ecommerceGetPspByPaymentMethodsError: RequestHandler = async (
  req,
  res
) => {
  logger.info("[Get psps by payment method id ecommerce] - Return error case");
  return pipe(
    req.body,
    CalculateFeeRequest.decode,
    E.map(() => res.status(400).send(error400BadRequest()))
  );
};

export const ecommerceGetPspNotFound: RequestHandler = async (req, res) => {
  logger.info("[Get psps by payment method id ecommerce] - Return error case");
  return pipe(
    req.body,
    CalculateFeeRequest.decode,
    E.map(() => res.status(404).send(error404NotFound()))
  );
};
