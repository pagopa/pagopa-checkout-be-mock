/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as TE from "fp-ts/lib/TaskEither";
import { v4 as uuid } from "uuid";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { FlowCase, getFlowCookie, getSessionIdCookie } from "../../flow";
import {
  createSuccessAuthRequestResponseEntity,
  createSuccessAuthRequestResponseEntityFromNPG,
  error400InvalidRequestBody,
  error404TransactionIdNotFound,
  error409TransactionAlreadyProcessed
} from "../../utils/ecommerce/auth-request";
import { logger } from "../../logger";
import { RequestAuthorizationRequest } from "../../generated/ecommerce/RequestAuthorizationRequest";
import {
  PaymentInstrumentDetail2,
  PaymentInstrumentDetail3
} from "../../generated/ecommerce/PaymentInstrumentDetail";
import { RequestAuthorizationResponse } from "../../generated/ecommerce/RequestAuthorizationResponse";
import { config } from "../../config";

const PSP_API_KEY = config.PSP_API_KEY;

const confirmPaymentFromNpg = async (_req: any, res: any): Promise<void> => {
  const sessionId = getSessionIdCookie(_req);
  const postData = JSON.stringify({
    amount: _req.body.amount,
    sessionId
  });

  logger.info(
    `[Invoke NPG confirm payment with npg-session id: ${sessionId}] - Return success case`
  );

  const correlationId = uuid();
  const url = `https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1/build/confirm_payment`;
  const response = await fetch(url, {
    body: postData,
    headers: {
      "Content-Type": "application/json",
      "Correlation-Id": correlationId,
      "X-Api-key": PSP_API_KEY
    },
    method: "POST"
  });

  await pipe(
    TE.tryCatch(
      async () => response.json(),
      _e => {
        logger.error("Error invoking npg order build");
      }
    ),
    TE.map(resp => {
      pipe(
        resp,
        createSuccessAuthRequestResponseEntityFromNPG,
        RequestAuthorizationResponse.decode,
        E.fold(
          () => {
            logger.error("Error while invoke NPG unexpected body");
            res.status(response.status).send(resp);
          },
          responseBody => res.status(response.status).send(responseBody)
        )
      );
    }),
    TE.mapLeft(() => res.status(response.status).send())
  )();
};

const processAuthorizationRequest = (req: any, res: any): void => {
  pipe(
    req.body,
    RequestAuthorizationRequest.decode,
    O.fromEither,
    O.fold(
      () => res.status(400).send(error400InvalidRequestBody()),
      resp => {
        pipe(
          resp.details,
          PaymentInstrumentDetail3.decode,
          O.fromEither,
          O.fold(
            () => {
              pipe(
                resp.details,
                PaymentInstrumentDetail2.decode,
                O.fromEither,
                O.map(
                  () =>
                    res
                      .status(200)
                      .send(createSuccessAuthRequestResponseEntity()) // Type card invoke PGS
                )
              );
            },
            () => confirmPaymentFromNpg(req, res) // Type card invoke NPG
          )
        );
      }
    )
  );
};

const return409ErrorTransactionAlreadyProcessed = (
  transactionId: string,
  res: any
): void => {
  logger.info(
    "[Auth-request ecommerce] - Return 409 TRANSACTION_ID_ALREADY_PROCESSED"
  );
  res.status(409).send(error409TransactionAlreadyProcessed(transactionId));
};

const return404ErrorTransactionIdNotFound = (
  transactionId: string,
  res: any
): void => {
  logger.info("[Auth-request ecommerce] - Return 404 TRANSACTION_ID_NOT_FOUND");
  res.status(404).send(error404TransactionIdNotFound(transactionId));
};

export const ecommerceAuthRequest: RequestHandler = async (req, res) => {
  const transactionId = req.params.transactionId;
  switch (getFlowCookie(req)) {
    case FlowCase.FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED:
      return409ErrorTransactionAlreadyProcessed(transactionId, res);
      break;
    case FlowCase.FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND:
      return404ErrorTransactionIdNotFound(transactionId, res);
      break;
    default:
      processAuthorizationRequest(req, res);
  }
};
