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
import { XPayFlowCase, getXPayFlowCase } from "../flow";

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
