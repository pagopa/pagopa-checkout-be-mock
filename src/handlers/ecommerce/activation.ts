/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as express from "express";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import { logger } from "../../logger";
import {
  createSuccessActivationResponseEntity,
  error502SintassiXSD,
  error504StazioneIntTimeout,
  error409PagamentoInCorso,
  error404DominioSconosciuto,
  error404ResourceNotFound
} from "../../utils/ecommerce/activation";
import {
  FlowCase,
  generateTransactionId,
  getErrorCodeFromRptId,
  getFlowFromRptId,
  getGatewayFromRptId,
  getSendPaymentResultOutcomeFromRptId,
  SendPaymentResultOutcomeCase,
  setErrorCodeCookie,
  setFlowCookie,
  setPaymentGatewayCookie,
  setSendPaymentResultOutcomeCookie,
  VposFlowCase,
  XPayFlowCase
} from "../../flow";

const caluclateFeeCase = [
  FlowCase.OK_ABOVETHRESHOLD_CALUCLATE_FEE,
  FlowCase.OK_BELOWTHRESHOLD_CALUCLATE_FEE,
  FlowCase.FAIL_CALCULATE_FEE
];

const transactionUserCancelCase = [
  FlowCase.ID_NOT_FOUND_TRANSACTION_USER_CANCEL,
  FlowCase.OK_TRANSACTION_USER_CANCEL,
  FlowCase.INTERNAL_SERVER_ERROR_TRANSACTION_USER_CANCEL
];

const activationErrorCase = [
  FlowCase.FAIL_ACTIVATE_502_PPT_SINTASSI_XSD,
  FlowCase.FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT,
  FlowCase.FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO,
  FlowCase.FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO,
  FlowCase.ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_NOT_FOUND,
  FlowCase.ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS,
  FlowCase.ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS_2_RETRY,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_AUTH,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_AUTH,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_AUTH,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_AUTH,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_DENY,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_DENY,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_DENY,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_DENY,
  FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_PAYMENT_NOT_FOUND
];

const authErrorCase = [
  FlowCase.FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED,
  FlowCase.FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND
];

const pgsEsitoMappingCase = [
  FlowCase.NOTIFICATION_REQUESTED,
  FlowCase.NOTIFICATION_ERROR,
  FlowCase.NOTIFIED_KO,
  FlowCase.REFUNDED,
  FlowCase.REFUND_REQUESTED,
  FlowCase.REFUND_ERROR,
  FlowCase.CLOSURE_ERROR,
  FlowCase.EXPIRED_NOT_AUTHORIZED,
  FlowCase.CANCELED,
  FlowCase.CANCELLATION_EXPIRED,
  FlowCase.EXPIRED,
  FlowCase.UNAUTHORIZED,
  FlowCase.CLOSED
];

const returnSuccessResponse = (
  req: express.Request,
  res: any,
  transactionIdPrefix?: number
): void => {
  logger.info("[Activation ecommerce] - Return success case");
  res
    .status(200)
    .send(
      createSuccessActivationResponseEntity(
        req,
        generateTransactionId(transactionIdPrefix)
      )
    );
};

const return502ErrorSintassiXSD = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 502 FAIL_VERIFY_502_PPT_SINTASSI_XSD"
  );
  res.status(502).send(error502SintassiXSD());
};

const return504ErrorStazioneIntPaTimeout = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 504 FAIL_VERIFY_504_PPT_STAZIONE_INT_PA_TIMEOUT"
  );
  res.status(504).send(error504StazioneIntTimeout());
};

const return409ErrorPagamentoInCorso = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 409 PPT_PAGAMENTO_IN_CORSO");
  res.status(409).send(error409PagamentoInCorso());
};

const return404ErrorDominioSconosciuto = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 404 FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO"
  );
  res.status(404).send(error404DominioSconosciuto());
};

const return404ResourceNotFound = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 404 Resource not found");
  res.status(404).send(error404ResourceNotFound());
};

export const ecommerceActivation: RequestHandler = async (req, res) => {
  const version = req.path.match(/\/ecommerce\/checkout\/(\w{2})/)?.slice(1);
  logger.info(`[Activation ecommerce] - version: ${version}`);
  if (req.query.recaptchaResponse == null) {
    logger.error("Missing recaptchaResponse query param!");
    return404ResourceNotFound(res);
    return;
  }
  const sendPaymentResultOutcome = pipe(
    req.body.paymentNotices[0].rptId,
    getSendPaymentResultOutcomeFromRptId,
    O.getOrElse(() => SendPaymentResultOutcomeCase.UNDEFINED)
  );

  const paymentGateway = pipe(
    req.body.paymentNotices[0].rptId,
    getGatewayFromRptId,
    O.getOrElseW(() => undefined)
  );

  const errorCode = getErrorCodeFromRptId(req.body.paymentNotices[0].rptId);

  const flowId = pipe(
    req.body.paymentNotices[0].rptId,
    getFlowFromRptId,
    O.map(id =>
      !authErrorCase.includes(id) &&
      !activationErrorCase.includes(id) &&
      !caluclateFeeCase.includes(id) &&
      !transactionUserCancelCase.includes(id) &&
      !pgsEsitoMappingCase.includes(id)
        ? FlowCase.OK
        : id
    ),
    O.getOrElse(() => FlowCase.OK)
  );
  switch (flowId) {
    case FlowCase.FAIL_ACTIVATE_502_PPT_SINTASSI_XSD:
      return502ErrorSintassiXSD(res);
      break;
    case FlowCase.FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT:
      return504ErrorStazioneIntPaTimeout(res);
      break;
    case FlowCase.FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO:
      return409ErrorPagamentoInCorso(res);
      break;
    case FlowCase.FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO:
      return404ErrorDominioSconosciuto(res);
      break;
    case FlowCase.ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_NOT_FOUND:
      returnSuccessResponse(req, res);
      break;
    case FlowCase.ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS_2_RETRY:
      returnSuccessResponse(req, res, XPayFlowCase.MULTI_ATTEMPT_POLLING);
      break;
    case FlowCase.ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS:
      returnSuccessResponse(req, res, XPayFlowCase.OK);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_AUTH:
      returnSuccessResponse(req, res, VposFlowCase.DIRECT_AUTH);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_AUTH:
      returnSuccessResponse(req, res, VposFlowCase.METHOD_AUTH);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_AUTH:
      returnSuccessResponse(req, res, VposFlowCase.CHALLENGE_AUTH);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_AUTH:
      returnSuccessResponse(req, res, VposFlowCase.METHOD_CHALLENGE_AUTH);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_DENY:
      returnSuccessResponse(req, res, VposFlowCase.DIRECT_DENY);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_DENY:
      returnSuccessResponse(req, res, VposFlowCase.METHOD_DENY);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_DENY:
      returnSuccessResponse(req, res, VposFlowCase.CHALLENGE_DENY);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_DENY:
      returnSuccessResponse(req, res, VposFlowCase.METHOD_CHALLENGE_DENY);
      break;
    case FlowCase.ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_PAYMENT_NOT_FOUND:
      returnSuccessResponse(req, res, VposFlowCase.PAYMENT_NOT_FOUND);
      break;
    default:
      setFlowCookie(res, flowId);
      setSendPaymentResultOutcomeCookie(res, sendPaymentResultOutcome);
      setPaymentGatewayCookie(res, paymentGateway);
      setErrorCodeCookie(res, errorCode, paymentGateway);
      returnSuccessResponse(req, res);
  }
};
