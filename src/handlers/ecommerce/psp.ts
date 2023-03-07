/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { logger } from "../../logger";
import {
  createSuccessGetPspByPaymentMethodsIdResponseEntity,
  error400BadRequest
} from "../../utils/ecommerce/psp";
import { PaymentOption } from "../../generated/ecommerce/PaymentOption";

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
      () =>
        res
          .status(200)
          .send(createSuccessGetPspByPaymentMethodsIdResponseEntity())
    )
  );
};
