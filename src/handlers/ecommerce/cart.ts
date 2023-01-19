/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { logger } from "../../logger";
import { createSuccessGetCartResponseEntity } from "../../utils/ecommerce/cart";

export const ecommerceGetCart: RequestHandler = async (req, res) => {
  logger.info("[Get cart ecommerce] - Return success case");
  res.status(200).send(createSuccessGetCartResponseEntity());
};
