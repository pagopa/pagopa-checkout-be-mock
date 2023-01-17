import * as O from "fp-ts/lib/Option";
import * as express from "express";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/function";
import { logger } from "./logger";

const XPAY_OK_PREFIX = "0";
const XPAY_POLLING_PREFIX = "01";

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

export enum EcommerceActivationFlowCase {
  OK,
  FAIL_ACTIVATE_400,
  FAIL_VERIFY_502_PPT_SINTASSI_XSD
}

export const getEcommerceActivationFlowCase = (
  rptId: string
): EcommerceActivationFlowCase =>
  pipe(
    rptId,
    E.fromPredicate(reqId => reqId.endsWith("10"), identity),
    E.mapLeft(_ => EcommerceActivationFlowCase.OK),
    E.map(id =>
      pipe(
        id,
        E.fromPredicate(reqId => reqId.startsWith("16"), identity),
        E.mapLeft(_ => EcommerceActivationFlowCase.FAIL_ACTIVATE_400),
        E.map(
          _ => EcommerceActivationFlowCase.FAIL_VERIFY_502_PPT_SINTASSI_XSD
        ),
        E.toUnion
      )
    ),
    E.toUnion
  );
