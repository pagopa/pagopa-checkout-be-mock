/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { FlowCase, getFlowCookie } from "../../flow";
import { logger } from "../../logger";
import {
  createSuccessGetTransactionEntity,
  error404TransactionIdNotFound,
  internalServerError500
} from "../../utils/ecommerce/transaction";

export const ecommerceGetTransaction: RequestHandler = async (req, res) => {
  logger.info("[Get transaction ecommerce] - Return success case");
  res
    .status(200)
    .send(createSuccessGetTransactionEntity(req.params.transactionId));
};

const ecommerceDeleteTransaction500 = (res: any): void => {
  logger.info("[Delete transaction ecommerce] - Return error case 404");
  res.status(500).send(internalServerError500());
};

const ecommerceDeleteTransaction404 = (
  transactionId: string,
  res: any
): void => {
  logger.info("[Delete transaction ecommerce] - Return error case 404");
  res.status(404).send(error404TransactionIdNotFound(transactionId));
};

export const ecommerceDeleteTransaction: RequestHandler = async (req, res) => {
  logger.info("[User cancel transaction ecommerce]");
  switch (getFlowCookie(req)) {
    case FlowCase.INTERNAL_SERVER_ERROR_TRANSACTION_USER_CANCEL:
      ecommerceDeleteTransaction500(res);
      break;
    case FlowCase.ID_NOT_FOUND_TRANSACTION_USER_CANCEL:
      ecommerceDeleteTransaction404(req.params.transactionId, res);
      break;
    default:
      logger.info(
        "[Delete transaction ecommerce] - Return success case 202 accepted"
      );
      res.status(202).send();
  }
};
