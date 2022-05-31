import * as O from "fp-ts/lib/Option";
import * as express from "express";
import { pipe } from "fp-ts/function";

export enum FlowCase {
  OK,
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
  FAIL_CHECK_STATUS_500
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
  res.cookie("mockFlow", FlowCase[flowId]);
};
