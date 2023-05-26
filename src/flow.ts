import * as O from "fp-ts/lib/Option";
import * as express from "express";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/function";
import { v4 as uuid } from "uuid";
import { logger } from "./logger";
import { SendPaymentResultOutcomeEnum } from "./generated/ecommerce/NewTransactionResponse";

const XPAY_OK_PREFIX = "0";
const XPAY_POLLING_PREFIX = "01";

export enum ErrorCodeCaseVPOS {
  SUCCESS = "0",
  INCORRECT_PARAMS = "1",
  NOT_FOUND = "2",
  INCORRECT_MAC = "3",
  MAC_NOT_PRESENT = "4",
  TIMEOUT = "5",
  INVALID_APIKEY = "7",
  INVALID_CONTRACT = "8",
  DUPLICATE_TRANSACTION = "9",
  INVALID_GROUP = "12",
  TRANSACTION_NOT_FOUND = "13",
  EXPIRED_CARD = "14",
  CARD_BRAND_NOT_PERMITTED = "15",
  INVALID_STATUS = "16",
  EXCESSIVE_AMOUNT = "17",
  RETRY_EXHAUSTED = "18",
  REFUSED_PAYMENT = "19",
  CANCELED_3DS_AUTH = "20",
  FAILED_3DS_AUTH = "21",
  INVALID_CARD = "22",
  INVALID_MAC_ALIAS = "50",
  KO_RETRIABLE = "96",
  GENERIC_ERROR = "97",
  UNAVAILABLE_METHOD = "98",
  FORBIDDEN_OPERATION = "99",
  INTERNAL_ERROR = "100"
}

export enum ErrorCodeCaseXPAY {
  SUCCESS = "00",
  ORDER_OR_REQREFNUM_NOT_FOUND = "01",
  REQREFNUM_INVALID = "02",
  INCORRECT_FORMAT = "03",
  INCORRECT_MAC_OR_TIMESTAMP = "04",
  INCORRECT_DATE = "05",
  UNKNOWN_ERROR = "06",
  TRANSACTION_ID_NOT_FOUND = "07",
  OPERATOR_NOT_FOUND = "08",
  TRANSACTION_ID_NOT_CONSISTENT = "09",
  EXCEEDING_AMOUNT = "10",
  INCORRECT_STATUS = "11",
  CIRCUIT_DISABLED = "12",
  DUPLICATED_ORDER = "13",
  UNSUPPORTED_CURRENCY = "16",
  UNSUPPORTED_EXPONENT = "17",
  REDIRECTION_3DS1 = "20",
  TIMEOUT = "21",
  METHOD_REQUESTED = "25",
  CHALLENGE_REQUESTED = "26",
  PAYMENT_INSTRUMENT_NOT_ACCEPTED = "35",
  MISSING_CVV2 = "37",
  INVALID_PAN = "38",
  XML_EMPTY = "40",
  XML_NOT_PARSABLE = "41",
  INSTALLMENTS_NOT_AVAILABLE = "50",
  INSTALLMENT_NUMBER_OUT_OF_BOUNDS = "51",
  APPLICATION_ERROR = "98",
  TRANSACTION_FAILED = "99"
}

export enum GatewayCase {
  UNDEFINED,
  XPAY,
  VPOS
}

export enum SendPaymentResultOutcomeCase {
  UNDEFINED,
  OK,
  KO
}

export enum FlowCase {
  OK,
  OK_ENABLE_PERSISTENCE,
  /* pagopa-proxy: getPaymentInfo */
  ANSWER_VERIFY_NO_ENTE_BENEFICIARIO,
  FAIL_VERIFY_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA,
  FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO,
  FAIL_VERIFY_409_PPT_PAGAMENTO_IN_CORSO,
  FAIL_VERIFY_502_PPT_SINTASSI_XSD,
  FAIL_VERIFY_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE,
  FAIL_VERIFY_504_PPT_STAZIONE_INT_PA_TIMEOUT,
  FAIL_VERIFY_500,
  /* pagopa-proxy: activatePayment */
  FAIL_ACTIVATE_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA,
  FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO,
  FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO,
  FAIL_ACTIVATE_502_PPT_SINTASSI_XSD,
  FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE,
  FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT,
  FAIL_ACTIVATE_500,
  /* pagopa-proxy: getActivationStatus */
  FAIL_PAYMENT_STATUS_400,
  FAIL_PAYMENT_STATUS_404,
  FAIL_PAYMENT_STATUS_502,
  FAIL_PAYMENT_STATUS_500,
  /* payment-manager: addWalletUsingPOST */
  ANSWER_ADD_WALLET_STATUS_201,
  FAIL_ADD_WALLET_STATUS_403,
  FAIL_ADD_WALLET_STATUS_404,
  /* payment-manager: startSessionUsingPOST */
  ANSWER_START_SESSION_STATUS_201,
  FAIL_START_SESSION_STATUS_401,
  FAIL_START_SESSION_STATUS_403,
  FAIL_START_SESSION_STATUS_404,
  FAIL_START_SESSION_STATUS_422,
  FAIL_START_SESSION_STATUS_500,
  /* payment-manager: approveTermsUsingPOST */
  FAIL_APPROVE_TERMS_STATUS_404,
  FAIL_APPROVE_TERMS_STATUS_422,
  FAIL_APPROVE_TERMS_STATUS_500,
  /* payment-manager: pay3ds2UsingPOST */
  ANSWER_PAY_3DS2_STATUS_201,
  FAIL_PAY_3DS2_STATUS_401,
  FAIL_PAY_3DS2_STATUS_403,
  FAIL_PAY_3DS2_STATUS_404,
  /* payment-manager: checkStatusUsingGET */
  FAIL_CHECK_STATUS_404,
  FAIL_CHECK_STATUS_422,
  FAIL_CHECK_STATUS_500,
  NODO_TAKEN_IN_CHARGE,
  /* pagopa-ecommerce: auth-request */
  FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND,
  FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED,
  /* pagopa-ecommerce: ACTIVATION generate trasactionId for xpay */
  ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS,
  ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS_2_RETRY,
  ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_NOT_FOUND,
  /* pagopa-ecommerce: ACTIVATION generate trasactionId for vpos */
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_AUTH,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_AUTH,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_AUTH,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_AUTH,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_DENY,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_DENY,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_DENY,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_DENY,
  ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_PAYMENT_NOT_FOUND,
  /* pagopa-ecommerce: calculate/fee */
  OK_ABOVETHRESHOLD_CALUCLATE_FEE,
  OK_BELOWTHRESHOLD_CALUCLATE_FEE,
  FAIL_CALCULATE_FEE,
  /* pagopa-ecommerce: user transaction cancel */
  OK_TRANSACTION_USER_CANCEL,
  ID_NOT_FOUND_TRANSACTION_USER_CANCEL,
  INTERNAL_SERVER_ERROR_TRANSACTION_USER_CANCEL,
  /* pagopa-ecommerce: user transaction final state */
  NOTIFICATION_REQUESTED,
  NOTIFICATION_ERROR,
  NOTIFIED_KO,
  REFUNDED,
  REFUND_REQUESTED,
  REFUND_ERROR,
  CLOSURE_ERROR,
  EXPIRED_NOT_AUTHORIZED,
  CANCELED,
  CANCELLATION_EXPIRED,
  EXPIRED,
  UNAUTHORIZED
}

type FlowCaseKey = keyof typeof FlowCase;
// type SendPaymentResultOutcomeCaseKey = keyof typeof SendPaymentResultOutcomeCase;
type GatewayCaseKey = keyof typeof GatewayCase;
type SendPaymentResultOutcomeEnumKey = keyof typeof SendPaymentResultOutcomeEnum;

export const getFlowFromRptId: (
  rptId: string
) => O.Option<FlowCase> = rptId => {
  const flowId = Number(rptId.slice(-2));
  if (flowId in FlowCase) {
    return O.some(flowId as FlowCase);
  } else {
    return O.none;
  }
};

export const getErrorCodeFromRptId: (rptId: string) => string = rptId =>
  rptId.slice(-5, -2);

export const getGatewayFromRptId: (
  rptId: string
) => O.Option<GatewayCase> = rptId => {
  const flowId = Number(rptId.slice(-6, -5));
  if (flowId in GatewayCase) {
    return O.some(flowId as GatewayCase);
  } else {
    return O.none;
  }
};

export const getSendPaymentResultOutcomeFromRptId: (
  rptId: string
) => O.Option<SendPaymentResultOutcomeCase> = rptId => {
  const flowId = Number(rptId.slice(-7, -6));
  if (flowId in SendPaymentResultOutcomeCase) {
    return O.some(flowId as SendPaymentResultOutcomeCase);
  } else {
    return O.none;
  }
};

export const maybeGetFlowCookie: (
  req: express.Request
) => O.Option<FlowCase> = req =>
  pipe(
    O.fromNullable(req.cookies.mockFlow),
    id => {
      logger.info(`Request mockFlow cookie: [${req.cookies.mockFlow}]`);
      return id;
    },
    O.filter(id => id in FlowCase),
    O.map((id: FlowCaseKey) => FlowCase[id])
  );

export const getFlowCookie: (req: express.Request) => FlowCase = req =>
  pipe(
    maybeGetFlowCookie(req),
    O.getOrElse(() => FlowCase.OK as FlowCase)
  );

export const maybeGetSendPaymentResultCookie: (
  req: express.Request
) => O.Option<SendPaymentResultOutcomeEnum> = req =>
  pipe(
    O.fromNullable(req.cookies.sendPaymentResult),
    id => {
      logger.info(
        `Request sendPaymentResult cookie: [${req.cookies.sendPaymentResult}]`
      );
      return id;
    },
    O.filter(id => id in SendPaymentResultOutcomeCase),
    O.map(
      (id: SendPaymentResultOutcomeEnumKey) => SendPaymentResultOutcomeEnum[id]
    )
  );

export const getSendPaymentResultCookie: (
  req: express.Request
) => SendPaymentResultOutcomeEnum = req =>
  pipe(
    maybeGetSendPaymentResultCookie(req),
    O.getOrElse(() => (undefined as unknown) as SendPaymentResultOutcomeEnum)
  );

export const maybeGetPaymentGatewayCookie: (
  req: express.Request
) => O.Option<string> = req =>
  pipe(
    O.fromNullable(req.cookies.paymentGateway),
    id => {
      logger.info(
        `Request paymentGateway cookie: [${req.cookies.paymentGateway}]`
      );
      return id;
    },
    O.filter(id => id in GatewayCase),
    O.map((id: GatewayCaseKey) => id)
  );

export const getPaymentGatewayCookie: (req: express.Request) => string = req =>
  pipe(
    maybeGetPaymentGatewayCookie(req),
    O.getOrElse(() => GatewayCase.UNDEFINED.toString())
  );

export const setFlowCookie: (
  res: express.Response,
  flowId: FlowCase
) => void = (res, flowId) => {
  logger.info(`Set mockFlow cookie to: [${FlowCase[flowId]}]`);
  res.cookie("mockFlow", FlowCase[flowId]);
};

export const setErrorCodeCookie: (
  res: express.Response,
  errorCodeId: string,
  gateway: GatewayCase
) => void = (res, errorCodeId, gateway) => {
  switch (GatewayCase[gateway]) {
    case "XPAY":
      const errorIdXPAY = ("" + errorCodeId).slice(-2);
      if (
        Object.values(ErrorCodeCaseXPAY).filter(v => v === errorIdXPAY)
          .length === 1
      ) {
        logger.info(
          `Set resultCodeGateway cookie to: [${errorIdXPAY as ErrorCodeCaseXPAY}]`
        );
        res.cookie("resultCodeGateway", errorIdXPAY as ErrorCodeCaseXPAY);
      }
      break;
    case "VPOS":
      const errorIdVPOS = Number(errorCodeId).toString();
      if (
        Object.values(ErrorCodeCaseVPOS).filter(v => v === errorIdVPOS)
          .length === 1
      ) {
        logger.info(
          `Set resultCodeGateway cookie to: [${errorIdVPOS as ErrorCodeCaseVPOS}]`
        );
        res.cookie("resultCodeGateway", errorIdVPOS as ErrorCodeCaseVPOS);
      }
      break;
    default:
      res.clearCookie("resultCodeGateway");
  }
};

export const setPaymentGatewayCookie: (
  res: express.Response,
  gatewayID: GatewayCase
) => void = (res, gatewayID) => {
  logger.info(`Set paymentGateway cookie to: [${GatewayCase[gatewayID]}]`);
  res.cookie("paymentGateway", GatewayCase[gatewayID]);
};

export const setSendPaymentResultOutcomeCookie: (
  res: express.Response,
  sendPaymentResultId: SendPaymentResultOutcomeCase
) => void = (res, sendPaymentResultId) => {
  logger.info(
    `Set sendPaymentResult cookie to: [${SendPaymentResultOutcomeCase[sendPaymentResultId]}]`
  );
  res.cookie(
    "sendPaymentResult",
    SendPaymentResultOutcomeCase[sendPaymentResultId]
  );
};

export enum XPayFlowCase {
  OK,
  MULTI_ATTEMPT_POLLING,
  NOT_FOUND
}

export const getXPayFlowCase = (requestId: string): XPayFlowCase =>
  pipe(
    requestId,
    E.fromPredicate(id => id.startsWith(XPAY_OK_PREFIX), identity),
    E.mapLeft(_ => XPayFlowCase.NOT_FOUND),
    E.map(id =>
      pipe(
        id,
        E.fromPredicate(
          reqId => reqId.startsWith(XPAY_POLLING_PREFIX),
          identity
        ),
        E.mapLeft(_ => XPayFlowCase.OK),
        E.map(_ => XPayFlowCase.MULTI_ATTEMPT_POLLING),
        E.toUnion
      )
    ),
    E.toUnion
  );

export enum VposStep {
  STEP_0,
  METHOD,
  CHALLENGE,
  AUTH,
  DENY,
  NOT_FOUND
}
type VposStepKey = keyof typeof VposStep;

export enum VposFlowCase {
  DIRECT_AUTH,
  METHOD_AUTH,
  CHALLENGE_AUTH,
  METHOD_CHALLENGE_AUTH,
  DIRECT_DENY,
  METHOD_DENY,
  CHALLENGE_DENY,
  METHOD_CHALLENGE_DENY,
  PAYMENT_NOT_FOUND
}

interface IVposMockInfo {
  readonly step: VposStep;
  readonly flowCase: VposFlowCase;
}

export const getVposFlow: (req: express.Request) => VposFlowCase = req => {
  const requestId = req.params.requestId.substring(0, 2);
  const flowId = Number(requestId);
  logger.info(`Request id: [${requestId}], flow id: [${flowId}]`);
  if (flowId in VposFlowCase) {
    return flowId as VposFlowCase;
  } else {
    return VposFlowCase.DIRECT_DENY;
  }
};

export const getVposStepCookie: (req: express.Request) => VposStep = req =>
  pipe(
    O.fromNullable(req.cookies.vposMockStep),
    id => {
      logger.info(`Request vposMockStep cookie: [${req.cookies.vposMockStep}]`);
      return id;
    },
    O.filter(id => id in VposStep),
    O.map((id: VposStepKey) => VposStep[id]),
    O.getOrElse(() => VposStep.STEP_0 as VposStep)
  );

export const getVposMockInfo: (
  req: express.Request
) => IVposMockInfo = req => ({
  flowCase: getVposFlow(req),
  step: getVposStepCookie(req)
});

export const setVposFlowCookies: (
  res: express.Response,
  vposStep: VposStep
) => void = (res, vposStep) => {
  logger.info(`Set vposMockStep cookie to: [${VposStep[vposStep]}]`);
  res.cookie("vposMockStep", VposStep[vposStep]);
};

export const generateTransactionId = (prefix?: number): string =>
  pipe(
    O.fromNullable(prefix),
    E.fromOption(() => uuid()),
    E.map(() =>
      String(prefix)
        .padStart(2, "0")
        .concat(uuid().substring(2))
    ),
    E.toUnion,
    uuidStringValue => uuidStringValue.replace(/-/g, "")
  );
