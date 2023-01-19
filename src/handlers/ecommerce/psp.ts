/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { logger } from "../../logger";
import {
  createSuccessGetPspResponseEntity,
  createSuccessGetPspByPaymentMethodsIdResponseEntity
} from "../../utils/ecommerce/psp";

export const ecommerceGetPsp: RequestHandler = async (req, res) => {
  logger.info("[Get psps ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPspResponseEntity());
};

export const ecommerceGetPspByPaymentMethods: RequestHandler = async (
  req,
  res
) => {
  logger.info(
    "[Get psps by payment method id ecommerce] - Return success case"
  );
  res.status(200).send(createSuccessGetPspByPaymentMethodsIdResponseEntity());
};
