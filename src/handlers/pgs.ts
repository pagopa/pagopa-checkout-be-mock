/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import { identity } from "io-ts";
import { logger } from "../logger";
import {
  createAuthorizedXPayPollingResponseEntity,
  createNotFoundXPayPollingResponseEntity,
  createSuccessXPayPollingResponseEntity
} from "../utils/xpay";
import {
  XPayFlowCase,
  getXPayFlowCase,
  VposStep,
  VposFlowCase,
  getVposMockInfo,
  setVposFlowCookies
} from "../flow";
import {
  createVposCcPaymentInfoAcceptedResponse,
  createVposCcPaymentInfoAcsResponse,
  createVposCcPaymentInfoError
} from "../utils/vpos";

// eslint-disable-next-line functional/no-let
let pollingAttempt = 2;

const returnSuccessResponse = (requestId: string, res: any): void => {
  logger.info("[authRequestXpay] - Return success case");
  res.status(200).send(createSuccessXPayPollingResponseEntity(requestId));
};

const returnNotFoundResponse = (res: any): void => {
  logger.info("[authRequestXpay] - Return error case");
  res.status(404).send(createNotFoundXPayPollingResponseEntity());
};

const returnAuthorizedResponse = async (
  requestId: string,
  res: any,
  delay: number
): Promise<void> => {
  logger.info("[authRequestXpay] - Return Authorized case");
  await new Promise(r => setTimeout(r, delay));
  res.status(200).send(createAuthorizedXPayPollingResponseEntity(requestId));
};

export const authRequestXpay: RequestHandler = async (req, res) => {
  switch (getXPayFlowCase(req.params.requestId)) {
    case XPayFlowCase.OK:
      returnSuccessResponse(req.params.requestId, res);
      break;
    case XPayFlowCase.NOT_FOUND:
      returnNotFoundResponse(res);
      break;
    case XPayFlowCase.MULTI_ATTEMPT_POLLING:
      pipe(
        pollingAttempt,
        E.fromPredicate(retry => retry === 0, identity),
        E.mapLeft(async r => {
          pollingAttempt = r - 1;
          await returnAuthorizedResponse(req.params.requestId, res, 2000);
        }),
        E.map(_r => {
          pollingAttempt = 2;
          returnSuccessResponse(req.params.requestId, res);
        })
      );
      break;
    default:
      returnNotFoundResponse(res);
      break;
  }
};

export const directAuthSteps = (
  currentStep: VposStep,
  authorize: boolean
): VposStep => {
  if (currentStep === VposStep.STEP_0) {
    return authorize ? VposStep.AUTH : VposStep.DENY;
  } else {
    return VposStep.STEP_0;
  }
};

export const methodSteps = (
  currentStep: VposStep,
  authorize: boolean
): VposStep => {
  switch (currentStep) {
    case VposStep.STEP_0:
      return VposStep.METHOD;
    case VposStep.METHOD:
      return authorize ? VposStep.AUTH : VposStep.DENY;
    default:
      return VposStep.STEP_0;
  }
};

export const challengeSteps = (
  currentStep: VposStep,
  authorize: boolean
): VposStep => {
  switch (currentStep) {
    case VposStep.STEP_0:
      return VposStep.CHALLENGE;
    case VposStep.CHALLENGE:
      return authorize ? VposStep.AUTH : VposStep.DENY;
    default:
      return VposStep.STEP_0;
  }
};

export const methodChallengeSteps = (
  currentStep: VposStep,
  authorize: boolean
): VposStep => {
  switch (currentStep) {
    case VposStep.STEP_0:
      return VposStep.METHOD;
    case VposStep.METHOD:
      return VposStep.CHALLENGE;
    case VposStep.CHALLENGE:
      return authorize ? VposStep.AUTH : VposStep.DENY;
    default:
      return VposStep.STEP_0;
  }
};

export const logStepChange = (
  currentStep: VposStep,
  nextStep: VposStep,
  vposFlow: VposFlowCase
): VposStep => {
  logger.info(
    `VPOS flow [${VposFlowCase[vposFlow]}] stepping ${VposStep[currentStep]} -> ${VposStep[nextStep]}`
  );
  return nextStep;
};

export const vposNextStep = (
  currentStep: VposStep,
  vposFlow: VposFlowCase
): VposStep => {
  switch (vposFlow) {
    case VposFlowCase.DIRECT_AUTH:
      return directAuthSteps(currentStep, true);
    case VposFlowCase.DIRECT_DENY:
      return directAuthSteps(currentStep, false);
    case VposFlowCase.METHOD_AUTH:
      return methodSteps(currentStep, true);
    case VposFlowCase.METHOD_DENY:
      return methodSteps(currentStep, false);
    case VposFlowCase.CHALLENGE_AUTH:
      return challengeSteps(currentStep, true);
    case VposFlowCase.CHALLENGE_DENY:
      return challengeSteps(currentStep, false);
    case VposFlowCase.METHOD_CHALLENGE_AUTH:
      return methodChallengeSteps(currentStep, true);
    case VposFlowCase.METHOD_CHALLENGE_DENY:
      return methodChallengeSteps(currentStep, false);
    case VposFlowCase.PAYMENT_NOT_FOUND:
      return VposStep.NOT_FOUND;
    default:
      return VposStep.STEP_0;
  }
};

export const vposHandleResponse = (
  res: any,
  successResponseBody: any,
  pollingResponseBody: any,
  currentStep: VposStep,
  nextStep: VposStep
): void => {
  pipe(
    pollingAttempt,
    E.fromPredicate(retry => retry === 0, identity),
    E.mapLeft(async r => {
      pollingAttempt = r - 1;
      setVposFlowCookies(res, currentStep);
      res.status(200).send(pollingResponseBody);
    }),
    E.map(_r => {
      pollingAttempt = 2;
      setVposFlowCookies(res, nextStep);
      res.status(200).send(successResponseBody);
    })
  );
};

export const authRequestVpos: RequestHandler = async (req, res) => {
  const vposMockInfo = getVposMockInfo(req);
  const requestId = req.params.requestId;
  const currentStep = vposMockInfo.step;
  const nextStep = vposNextStep(vposMockInfo.step, vposMockInfo.flowCase);
  logStepChange(vposMockInfo.step, nextStep, vposMockInfo.flowCase);
  switch (nextStep) {
    case VposStep.STEP_0:
      res.status(404).send(createVposCcPaymentInfoError());
      break;
    case VposStep.AUTH:
      vposHandleResponse(
        res,
        createVposCcPaymentInfoAcceptedResponse(
          "AUTHORIZED",
          requestId,
          "http://client-return-url"
        ),
        createVposCcPaymentInfoAcceptedResponse("CREATED", requestId),
        currentStep,
        VposStep.STEP_0
      );
      break;
    case VposStep.CHALLENGE:
      vposHandleResponse(
        res,
        createVposCcPaymentInfoAcsResponse(
          "CREATED",
          requestId,
          "challenge",
          "http://challenge-url"
        ),
        createVposCcPaymentInfoAcceptedResponse("CREATED", requestId),
        currentStep,
        nextStep
      );
      break;
    case VposStep.DENY:
      vposHandleResponse(
        res,
        createVposCcPaymentInfoAcceptedResponse(
          "DENIED",
          requestId,
          "http://client-return-url"
        ),
        createVposCcPaymentInfoAcceptedResponse("CREATED", requestId),
        currentStep,
        VposStep.STEP_0
      );
      break;
    case VposStep.METHOD:
      vposHandleResponse(
        res,
        createVposCcPaymentInfoAcsResponse(
          "CREATED",
          requestId,
          "method",
          "http://method-url"
        ),
        createVposCcPaymentInfoAcceptedResponse("CREATED", requestId),
        currentStep,
        nextStep
      );
      break;
    case VposStep.NOT_FOUND:
      res.status(404).send(createVposCcPaymentInfoError());
      break;
    default:
      logger.error(`Unmanaged Vpos step: [${nextStep}]`);
      res.status(404).send(createVposCcPaymentInfoError());
      break;
  }
};
