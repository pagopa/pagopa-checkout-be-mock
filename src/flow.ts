import * as O from "fp-ts/lib/Option";
import * as express from "express";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/function";
import { logger } from "./logger";

const XPAY_OK_PREFIX = "0";
const XPAY_POLLING_PREFIX = "01";
const AUTH_REQUEST_TRANSACTION_SUCCESSFULLY_PROCESSED_PREFIX = "0";
const AUTH_REQUEST_ALREADY_PROCESSED_TRANSACTION_ID_PREFIX = "01";

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
  NODO_TAKEN_IN_CHARGE
}

type FlowCaseKey = keyof typeof FlowCase;

export const getFlowFromRptId: (
  rptId: string
) => O.Option<FlowCase> = rptId => {
  const prefix = rptId.slice(0, -2);
  const flowId = Number(rptId.slice(-2));
  if (prefix !== "777777777773020167237496700") {
    return O.none;
  }
  if (flowId in FlowCase) {
    return O.some(flowId as FlowCase);
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

export const setFlowCookie: (
  res: express.Response,
  flowId: FlowCase
) => void = (res, flowId) => {
  logger.info(`Set mockFlow cookie to: [${FlowCase[flowId]}]`);
  res.cookie("mockFlow", FlowCase[flowId]);
};

export enum XPayFlowCase {
  OK,
  NOT_FOUND,
  MULTI_ATTEMPT_POLLING
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

export enum AuthRequestFlowCase {
  TRANSACTION_SUCCESSFULLY_PROCESSED,
  TRANSACTION_ID_NOT_FOUND,
  TRANSACTION_ID_ALREADY_PROCESSED
}

export const getAuthRequestFlowCase = (
  transactionId: string
): AuthRequestFlowCase =>
  pipe(
    transactionId,
    E.fromPredicate(
      id =>
        id.startsWith(AUTH_REQUEST_TRANSACTION_SUCCESSFULLY_PROCESSED_PREFIX),
      identity
    ),
    E.mapLeft(_ => AuthRequestFlowCase.TRANSACTION_ID_NOT_FOUND),
    E.map(id =>
      pipe(
        id,
        E.fromPredicate(
          reqId =>
            reqId.startsWith(
              AUTH_REQUEST_ALREADY_PROCESSED_TRANSACTION_ID_PREFIX
            ),
          identity
        ),
        E.mapLeft(_ => AuthRequestFlowCase.TRANSACTION_SUCCESSFULLY_PROCESSED),
        E.map(_ => AuthRequestFlowCase.TRANSACTION_ID_ALREADY_PROCESSED),
        E.toUnion
      )
    ),
    E.toUnion
  );
