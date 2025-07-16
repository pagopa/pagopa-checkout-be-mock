/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as express from "express";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import { logger } from "../../logger";
import {
  createSuccessActivationResponseEntity,
  error400InvalidInput,
  error404PagamentoSconosciuto,
  error404StazioneIntPaSconosciuta,
  error409PagamentoInCorso,
  error502GenericError,
  error502PspSconosciuto,
  error502WispSessioneSconosciuta,
  error503StazioneIntPAErrorResponse,
  error503StazioneIntPATimeout
} from "../../utils/ecommerce/activation";
import {
  FlowCase,
  generateTransactionId,
  getFlowCookie,
  getFlowFromRptId,
  getTransactionOutcomeFromRptId,
  getTransactionOutcomeRetryFromRptId,
  setFlowCookie,
  setTransactionOutcomeCaseCookie,
  VposFlowCase,
  XPayFlowCase
} from "../../flow";
import { authService401 } from "./verify";

const caluclateFeeCase = [
  FlowCase.OK_ABOVETHRESHOLD_CALUCLATE_FEE,
  FlowCase.OK_BELOWTHRESHOLD_CALUCLATE_FEE,
  FlowCase.FAIL_CALCULATE_FEE,
  FlowCase.NOT_FOUND_CALCULATE_FEE
];

const transactionUserCancelCase = [
  FlowCase.ID_NOT_FOUND_TRANSACTION_USER_CANCEL,
  FlowCase.OK_TRANSACTION_USER_CANCEL,
  FlowCase.INTERNAL_SERVER_ERROR_TRANSACTION_USER_CANCEL
];

const activationErrorCase = [
  FlowCase.FAIL_ACTIVATE_400_INVALID_INPUT,
  FlowCase.FAIL_ACTIVATE_404_PPT_STAZIONE_INT_PA_SCONOSCIUTA,
  FlowCase.FAIL_ACTIVATE_404_PAA_PAGAMENTO_SCONOSCIUTO,
  FlowCase.FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO,
  FlowCase.FAIL_ACTIVATE_502_GENERIC_ERROR,
  FlowCase.FAIL_ACTIVATE_502_PPT_PSP_SCONOSCIUTO,
  FlowCase.FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_TIMEOUT,
  FlowCase.FAIL_ACTIVATE_502_GENERIC_ERROR,
  FlowCase.FAIL_ACTIVATE_502_PPT_WISP_SESSIONE_SCONOSCIUTA,
  FlowCase.FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE,
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
  FlowCase.FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND,
  FlowCase.FAIL_AUTH_REQUEST_5XX
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

const loginErrorCase = [
  FlowCase.FAIL_POST_AUTH_TOKEN,
  FlowCase.FAIL_GET_USERS_401,
  FlowCase.FAIL_GET_USERS_500
];

const logoutErrorCase = [FlowCase.FAIL_LOGOUT_400, FlowCase.FAIL_LOGOUT_500];

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

const return400InvalidInputError = (res: any): void => {
  logger.info("[Verify ecommerce] - Return 400 invalid input");
  res.status(400).send(error400InvalidInput());
};

const return404ErrorStazioneIntPaSconosciuta = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 404 PPT_STAZIONE_INT_PA_SCONOSCIUTA"
  );
  res.status(404).send(error404StazioneIntPaSconosciuta());
};

const return404PagamentoSconosciuto = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 404 PAA_PAGAMENTO_SCONOSCIUTO");
  res.status(404).send(error404PagamentoSconosciuto());
};

const return409ErrorPamentoInCorso = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 409 PPT_PAGAMENTO_IN_CORSO");
  res.status(409).send(error409PagamentoInCorso());
};

const return502PspSconosciuto = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 502 PPT_PSP_SCONOSCIUTO");
  res.status(502).send(error502PspSconosciuto());
};

const return502GenericError = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 502 GENERIC_ERROR category");
  res.status(502).send(error502GenericError());
};

const return502WispSessioneSconoscoita = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 502 PPT_WISP_SESSIONE_SCONOSCIUTA"
  );
  res.status(502).send(error502WispSessioneSconosciuta());
};

const return503StazioneIntPATimeout = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 503 PPT_STAZIONE_INT_PA_Timeout"
  );
  res.status(503).send(error503StazioneIntPATimeout());
};

const return503StazioneIntPAErrorResponse = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 503 PPT_STAZIONE_INT_PA_ERROR_RESPOONSE"
  );
  res.status(503).send(error503StazioneIntPAErrorResponse());
};

// eslint-disable-next-line complexity
export const ecommerceActivation: RequestHandler = async (req, res, _next) => {
  const version = req.path.match(/\/ecommerce\/checkout\/(\w{2})/)?.slice(1);
  logger.info(`[Activation ecommerce] - version: ${version}`);

  const transactionOutcomeInfoCaseId = pipe(
    req.body.paymentNotices[0].rptId,
    getTransactionOutcomeFromRptId,
    O.getOrElseW(() => undefined)
  );

  const retryOutcomeVal = pipe(
    req.body.paymentNotices[0].rptId,
    getTransactionOutcomeRetryFromRptId
  );


  // const errorCode = getErrorCodeFromRptId(req.body.paymentNotices[0].rptId);

  const flowId = pipe(
    req.body.paymentNotices[0].rptId,
    getFlowFromRptId,
    O.map(id =>
      !authErrorCase.includes(id) &&
      !activationErrorCase.includes(id) &&
      !caluclateFeeCase.includes(id) &&
      !transactionUserCancelCase.includes(id) &&
      !pgsEsitoMappingCase.includes(id) &&
      !loginErrorCase &&
      !logoutErrorCase
        ? FlowCase.OK
        : id
    ),
    O.getOrElse(() => FlowCase.OK)
  );
  switch (flowId) {
    case FlowCase.FAIL_ACTIVATE_400_INVALID_INPUT:
      return400InvalidInputError(res);
      break;
    case FlowCase.FAIL_ACTIVATE_404_PPT_STAZIONE_INT_PA_SCONOSCIUTA:
      return404ErrorStazioneIntPaSconosciuta(res);
      break;
    case FlowCase.FAIL_ACTIVATE_404_PAA_PAGAMENTO_SCONOSCIUTO:
      return404PagamentoSconosciuto(res);
      break;
    case FlowCase.FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO:
      return409ErrorPamentoInCorso(res);
      break;
    case FlowCase.FAIL_ACTIVATE_502_GENERIC_ERROR:
      return502GenericError(res);
      break;
    case FlowCase.FAIL_ACTIVATE_502_PPT_PSP_SCONOSCIUTO:
      return502PspSconosciuto(res);
      break;
    case FlowCase.FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_TIMEOUT:
      return503StazioneIntPATimeout(res);
      break;
    case FlowCase.FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE:
      return503StazioneIntPAErrorResponse(res);
      break;
    case FlowCase.FAIL_ACTIVATE_502_PPT_WISP_SESSIONE_SCONOSCIUTA:
      return502WispSessioneSconoscoita(res);
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
      setTransactionOutcomeCaseCookie(res, transactionOutcomeInfoCaseId, retryOutcomeVal);
      returnSuccessResponse(req, res);
  }
};

export const secureEcommerceActivation: RequestHandler = async (
  req,
  res,
  _next
) => {
  if (getFlowCookie(req) === FlowCase.FAIL_UNAUTHORIZED_401) {
    logger.info(
      "[Post trasactions activation ecommerce] - Return error case 401"
    );
    authService401(res);
  } else {
    ecommerceActivation(req, res, _next);
  }
};
