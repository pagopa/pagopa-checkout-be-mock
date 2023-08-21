/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { logger } from "../../logger";
import { createSuccessGetPaymentMethods } from "../../utils/ecommerce/payment-method";

export const ecommerceGetPaymentMethods: RequestHandler = async (req, res) => {
  logger.info("[Get payment-methods ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPaymentMethods());
};

export const createFormWithNpg: RequestHandler = async (req, res) => {
  

  res.status(200).send({});
};
