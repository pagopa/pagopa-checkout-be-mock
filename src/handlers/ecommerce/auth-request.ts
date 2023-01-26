/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { logger } from "../../logger";
import {
  createSuccessAuthRequestResponseEntity,
  error404TransactionIdNotFound,
  error409TransactionAlreadyProcessed
} from "../../utils/ecommerce/auth-request";
import { FlowCase, getFlowCookie } from "../../flow";

const returnSuccessResponse = (res: any): void => {
  logger.info("[Auth-request ecommerce] - Return success case");
  res.status(200).send(createSuccessAuthRequestResponseEntity());
};

const return409ErrorTransactionAlreadyProcessed = (
  transactionId: string,
  res: any
): void => {
  logger.info(
    "[Auth-request ecommerce] - Return 409 TRANSACTION_ID_ALREADY_PROCESSED"
  );
  res.status(409).send(error409TransactionAlreadyProcessed(transactionId));
};

const return404ErrorTransactionIdNotFound = (
  transactionId: string,
  res: any
): void => {
  logger.info("[Auth-request ecommerce] - Return 404 TRANSACTION_ID_NOT_FOUND");
  res.status(404).send(error404TransactionIdNotFound(transactionId));
};

export const ecommerceAuthRequest: RequestHandler = async (req, res) => {
  const transactionId = req.params.transactionId;
  switch (getFlowCookie(req)) {
    case FlowCase.FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED:
      return409ErrorTransactionAlreadyProcessed(transactionId, res);
      break;
    case FlowCase.FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND:
      return404ErrorTransactionIdNotFound(transactionId, res);
      break;
    default:
      returnSuccessResponse(res);
  }
};
