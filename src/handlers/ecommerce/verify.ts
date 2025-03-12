/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as express from "express";
import * as O from "fp-ts/Option";
import { logger } from "../../logger";
import {
  createSuccessVerifyRptIdEntity,
  error400InvalidInput,
  error404PagamentoSconosciuto,
  error404StazioneIntPaSconosciuta,
  error409PagamentoInCorso,
  error502GenericError,
  error502PspSconosciuto,
  error503StazioneIntPATimeout
} from "../../utils/ecommerce/verify";
import { FlowCase, getFlowFromRptId, setFlowCookie } from "../../flow";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";

const verifyErrorCase = [
  FlowCase.FAIL_VERIFY_400_INVALID_INPUT,
  FlowCase.FAIL_VERIFY_404_PPT_STAZIONE_INT_PA_SCONOSCIUTA,
  FlowCase.FAIL_VERIFY_404_PAA_PAGAMENTO_SCONOSCIUTO,
  FlowCase.FAIL_VERIFY_409_PPT_PAGAMENTO_IN_CORSO,
  FlowCase.FAIL_VERIFY_502_GENERIC_ERROR,
  FlowCase.FAIL_VERIFY_502_PPT_PSP_SCONOSCIUTO,
  FlowCase.FAIL_VERIFY_503_PPT_STAZIONE_INT_PA_TIMEOUT
];

const authErrorCase = [
  FlowCase.FAIL_POST_AUTH_TOKEN,
  FlowCase.FAIL_POST_AUTH_TOKEN_503,
  FlowCase.FAIL_POST_AUTH_TOKEN_504,
  FlowCase.FAIL_POST_AUTH_TOKEN_429,
  FlowCase.FAIL_GET_USERS_401,
  FlowCase.FAIL_GET_USERS_500,
  FlowCase.FAIL_UNAUTHORIZED_401,
  FlowCase.FAIL_UNAUTHORIZED_401_PAYMENT_REQUESTS
];

const returnSuccessResponse = (req: express.Request, res: any): void => {
  logger.info("[Verify ecommerce] - Return success case");
  res.status(200).send(createSuccessVerifyRptIdEntity(req.params.rptId));
};

const return400InvalidInputError = (res: any): void => {
  logger.info("[Verify ecommerce] - Return 400 invalid input");
  res.status(400).send(error400InvalidInput());
};

const return404ErrorStazioneIntPaSconosciuta = (res: any): void => {
  logger.info(
    "[Verify ecommerce] - Return 404 PPT_STAZIONE_INT_PA_SCONOSCIUTA"
  );
  res.status(404).send(error404StazioneIntPaSconosciuta());
};

const return404PagamentoSconosciuto = (res: any): void => {
  logger.info("[Verify ecommerce] - Return 404 PAA_PAGAMENTO_SCONOSCIUTO");
  res.status(404).send(error404PagamentoSconosciuto());
};

const return409ErrorPamentoInCorso = (res: any): void => {
  logger.info("[Verify ecommerce] - Return 409 PPT_PAGAMENTO_IN_CORSO");
  res.status(409).send(error409PagamentoInCorso());
};

const return502PspSconosciuto = (res: any): void => {
  logger.info("[Verify ecommerce] - Return 502 PPT_PSP_SCONOSCIUTO");
  res.status(502).send(error502PspSconosciuto());
};

const return502GenericError = (res: any): void => {
  logger.info("[Verify ecommerce] - Return 502 GENERIC_ERROR category");
  res.status(502).send(error502GenericError());
};

const return503StazioneIntPATimeout = (res: any): void => {
  logger.info("[Verify ecommerce] - Return 503 PPT_STAZIONE_INT_PA_Timeout");
  res.status(503).send(error503StazioneIntPATimeout());
};

const getFlowId = (rptId: string): FlowCase => {
  const maybeFlowId = getFlowFromRptId(rptId);
  if (O.isNone(maybeFlowId)) {
    return FlowCase.OK;
  }
  const flowId = maybeFlowId.value;
  if (verifyErrorCase.includes(flowId)) {
    return flowId;
  }
  if (authErrorCase.includes(flowId)) {
    return flowId;
  }
  return FlowCase.OK;
};

const ecommerceVerify: RequestHandler = async (req, res, _next) => {
  const flowId = getFlowId(req.params.rptId);
  // eslint-disable-next-line no-console
  console.log(flowId);
  switch (flowId) {
    case FlowCase.FAIL_VERIFY_400_INVALID_INPUT:
      return400InvalidInputError(res);
      break;
    case FlowCase.FAIL_VERIFY_404_PPT_STAZIONE_INT_PA_SCONOSCIUTA:
      return404ErrorStazioneIntPaSconosciuta(res);
      break;
    case FlowCase.FAIL_VERIFY_404_PAA_PAGAMENTO_SCONOSCIUTO:
      return404PagamentoSconosciuto(res);
      break;
    case FlowCase.FAIL_VERIFY_409_PPT_PAGAMENTO_IN_CORSO:
      return409ErrorPamentoInCorso(res);
      break;
    case FlowCase.FAIL_VERIFY_502_GENERIC_ERROR:
      return502GenericError(res);
      break;
    case FlowCase.FAIL_VERIFY_502_PPT_PSP_SCONOSCIUTO:
      return502PspSconosciuto(res);
      break;
    case FlowCase.FAIL_VERIFY_503_PPT_STAZIONE_INT_PA_TIMEOUT:
      return503StazioneIntPATimeout(res);
      break;
    default:
      setFlowCookie(res, flowId);
      returnSuccessResponse(req, res);
  }
};

export const authService401 = (res: any): void => {
  const response: ProblemJson = {
    title: "Unauthorized Access"
  };
  res.status(401).send(response);
};

export const ecommerceVerifyHandler: RequestHandler = async (
  req,
  res,
  _next
) => {
  if (req.query.recaptchaResponse == null) {
    logger.error("Missing recaptchaResponse query param!");
    res.status(404).send("Missing recaptchaResponse query param!");
    return;
  }
  ecommerceVerify(req, res, _next);
};

export const secureEcommerceVerify: RequestHandler = async (
  req,
  res,
  _next
) => {
  const flowId = getFlowId(req.params.rptId);
  if (flowId === FlowCase.FAIL_UNAUTHORIZED_401_PAYMENT_REQUESTS) {
    logger.info("[Verify ecommerce] - Return error case 401");
    authService401(res);
  } else {
    ecommerceVerify(req, res, _next);
  }
};
