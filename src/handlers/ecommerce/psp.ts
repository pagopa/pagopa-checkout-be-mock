/* eslint-disable sonarjs/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { logger } from "../../logger";
import {
  createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold,
  createSuccessGetPspByPaymentMethodsIdResponseEntityUpThreshold,
  error400BadRequest
} from "../../utils/ecommerce/psp";
import { PaymentOption } from "../../generated/ecommerce/PaymentOption";
import { FlowCase, getFlowCookie } from "../../flow";

export const ecommerceGetPspByPaymentMethods: RequestHandler = async (
  req,
  res
) => {
  logger.info(
    "[Get psps by payment method id ecommerce] - Return success case"
  );
  return pipe(
    req.body,
    PaymentOption.decode,
    E.fold(
      () => res.status(400).send(error400BadRequest()),
      () => {
        switch (getFlowCookie(req)) {
          case FlowCase.FAIL_CALCULATE_FEE:
            return res.status(400).send(error400BadRequest());
          case FlowCase.OK_BELOWTHRESHOLD_CALUCLATE_FEE:
            return res
              .status(200)
              .send(
                createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold()
              ); 
          case FlowCase.OK_UPTHRESHOLD_CALUCLATE_FEE:
            return res
              .status(200)
              .send(
                createSuccessGetPspByPaymentMethodsIdResponseEntityUpThreshold()
              );
          default:
            return res
              .status(200)
              .send(
                createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold()
              );
        }
      }
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
    PaymentOption.decode,
    E.map(() => res.status(400).send(error400BadRequest()))
  );
};
