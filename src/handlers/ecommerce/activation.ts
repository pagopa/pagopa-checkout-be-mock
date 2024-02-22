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

const npgEsitoMappingCase = [
  FlowCase.AUTHORIZATION_REQUESTED_NO_NPG_OUTCOME,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_EXECUTED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_AUTHORIZED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_PENDING,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_VOIDED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_REFUNDED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_FAILED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_CANCELED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999,
  FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_AUTHORIZED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_PENDING,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_VOIDED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_REFUNDED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_FAILED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_CANCELED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999,
  FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_AUTHORIZED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_PENDING,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_VOIDED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_REFUNDED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_FAILED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_CANCELED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_THREEDS_FAILED,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999,
  FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
  FlowCase.CLOSED_WITH_NPG_AUTH_STATUS_EXECUTED_SEND_PAYMENT_RESULT_NOT_RECEIVED,
  FlowCase.NOTIFICATION_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED_AND_END_PAYMENT_RESULT_OK,
  FlowCase.NOTIFICATION_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED_AND_END_PAYMENT_RESULT_KO,
  FlowCase.NOTIFICATION_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED_AND_END_PAYMENT_RESULT_OK,
  FlowCase.NOTIFICATION_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED_AND_END_PAYMENT_RESULT_KO,
  FlowCase.NOTIFIED_OK_WITH_NPG_AUTH_STATUS_EXECUTED_AND_END_PAYMENT_RESULT_OK,
  FlowCase.NOTIFIED_KO_WITH_NPG_AUTH_STATUS_EXECUTED_AND_END_PAYMENT_RESULT_KO
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
      !npgEsitoMappingCase.includes(id) &&
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
