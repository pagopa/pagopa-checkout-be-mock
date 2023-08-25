/* eslint-disable sort-keys */
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { v4 as uuid } from "uuid";
import { logger } from "../../logger";
import { createSuccessGetPaymentMethods } from "../../utils/ecommerce/payment-method";
import { CreateSessionResponse } from "../../generated/ecommerce/CreateSessionResponse";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { Field } from "../../generated/ecommerce/Field";
import { SessionPaymentMethodResponse } from "../../generated/ecommerce/SessionPaymentMethodResponse";

export const ecommerceGetPaymentMethods: RequestHandler = async (req, res) => {
  logger.info("[Get payment-methods ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPaymentMethods());
};

const NPG_APY_KEY = process.env.NPG_APY_KEY;

export const internalServerError = (): ProblemJson => ({
  detail: "Internal Server Error",
  title: "Invalid npg body response"
});

export const buildRetrieveCardDataResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonResponse: any
): SessionPaymentMethodResponse => ({
  sessionId: "sessionId",
  bin: jsonResponse.bin,
  expiringDate: jsonResponse.expiringDate,
  lastFourDigits: jsonResponse.lastFourDigits,
  brand: jsonResponse.circuit
});

export const buildCreateSessionResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonResponse: any
): CreateSessionResponse => ({
  sessionId: jsonResponse.sessionId,
  paymentMethodData: {
    paymentMethod: "CARDS",
    form: jsonResponse.fields as ReadonlyArray<Field>
  }
});

export const createFormWithNpg: RequestHandler = async (_req, res) => {
  logger.info(
    `[Get Payment Method npg-session id: ${_req.params.id}] - Return success case`
  );

  const postData = JSON.stringify({
    merchantUrl: `${_req.protocol}://${_req.get("Host")}`,
    order: {
      amount: "1000",
      currency: "EUR",
      orderId: "btid23838555"
    },
    paymentSession: {
      actionType: "PAY",
      amount: "1000",
      cancelUrl: "https://checkout.pagopa/cancel",
      language: "ITA",
      notificationUrl: "https://merchanturl.it",
      paymentService: "CARDS",
      resultUrl: "https://checkout.pagopa.it/esito"
    },
    version: "2"
  });

  const correlationId = uuid();
  const response = await fetch(
    "https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1/orders/build",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Correlation-Id": correlationId,
        "X-Api-key": NPG_APY_KEY as string
      },
      body: postData
    }
  );

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
        buildCreateSessionResponse,
        CreateSessionResponse.decode,
        E.mapLeft(() => res.status(500).send(internalServerError())),
        E.map(val => res.status(response.status).send(val))
      );
    }),
    TE.mapLeft(() => res.status(500).send(internalServerError()))
  )();
};

export const retrieveCardDataFromNpg: RequestHandler = async (_req, res) => {
  const sessionId = _req.params.idSession;
  const encodedSessionId = encodeURIComponent(sessionId);
  logger.info(
    `[Retrieve card data from NPG with npg-session id: ${encodedSessionId}] - Return success case`
  );
  const correlationId = uuid();
  const url = `https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1/build/cardData?sessionId=${encodedSessionId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Correlation-Id": correlationId,
      "X-Api-key": NPG_APY_KEY as string
    }
  });
  await pipe(
    TE.tryCatch(
      async () => response.json(),
      _e => {
        logger.error("Error invoking npg for retrieve card data");
      }
    ),
    TE.map(resp => {
      pipe(
        resp,
        buildRetrieveCardDataResponse,
        SessionPaymentMethodResponse.decode,
        E.mapLeft(() => res.status(500).send(internalServerError())),
        E.map(val => {
          res.status(response.status).send(val);
        })
      );
    }),
    TE.mapLeft(() => res.status(500).send(internalServerError()))
  )();
};
