/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import {
  FlowCase,
  getErrorCodeCookie,
  getFlowCookie,
  getPaymentGatewayCookie,
  getSendPaymentResultCookie
} from "../../flow";
import { logger } from "../../logger";
import {
  createSuccessGetTransactionEntity,
  error404TransactionIdNotFound,
  internalServerError500
} from "../../utils/ecommerce/transaction";
import { TransactionStatusEnum } from "../../generated/ecommerce/TransactionStatus";

export const ecommerceGetTransaction: RequestHandler = async (req, res) => {
  logger.info("[Get transaction ecommerce] - Return success case");
  const gateway = getPaymentGatewayCookie(req);
  const errorCode = getErrorCodeCookie(req);
  const sendPaymentResultOutcome = getSendPaymentResultCookie(req);
  switch (getFlowCookie(req)) {
    case FlowCase.NOTIFICATION_REQUESTED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.NOTIFICATION_REQUESTED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.NOTIFICATION_ERROR:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.NOTIFICATION_ERROR,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.NOTIFIED_KO:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.NOTIFIED_KO,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.REFUNDED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.REFUNDED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.REFUND_REQUESTED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.REFUND_REQUESTED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.REFUND_ERROR:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.REFUND_ERROR,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.CLOSURE_ERROR:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.CLOSURE_ERROR,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.EXPIRED_NOT_AUTHORIZED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.CANCELED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.CANCELED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.CANCELLATION_EXPIRED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.CANCELLATION_EXPIRED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.EXPIRED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.EXPIRED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    case FlowCase.UNAUTHORIZED:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.UNAUTHORIZED,
            gateway,
            errorCode,
            sendPaymentResultOutcome
          )
        );
    default:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.NOTIFIED_OK
          )
        );
  }
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
