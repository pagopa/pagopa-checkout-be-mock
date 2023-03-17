/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { logger } from "../../logger";
import { createSuccessGetTransactionEntity } from "../../utils/ecommerce/transaction";

export const ecommerceGetTransaction: RequestHandler = async (req, res) => {
  logger.info("[Get transaction ecommerce] - Return success case");
  res
    .status(200)
    .send(createSuccessGetTransactionEntity(req.params.transactionId));
};

export const ecommerceDeleteTransaction: RequestHandler = async (req, res) => {
  logger.info("[User cancel transaction ecommerce]");
  res.status(202).send();
};
