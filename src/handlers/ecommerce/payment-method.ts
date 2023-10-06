/* eslint-disable sort-keys */
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { v4 as uuid } from "uuid";
import { formatValidationErrors } from "io-ts-reporters";
import { logger } from "../../logger";
import { createSuccessGetPaymentMethods } from "../../utils/ecommerce/payment-method";
import { CreateSessionResponse } from "../../generated/ecommerce/CreateSessionResponse";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { Field } from "../../generated/ecommerce/Field";
import { SessionPaymentMethodResponse } from "../../generated/ecommerce/SessionPaymentMethodResponse";
import { config } from "../../config";
import { getSessionIdCookie, setSessionIdCookie } from "../../flow";

export const ecommerceGetPaymentMethods: RequestHandler = async (req, res) => {
  logger.info("[Get payment-methods ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPaymentMethods());
};

const NPG_API_KEY = config.NPG_API_KEY;

export const internalServerError = (): ProblemJson => ({
  detail: "Internal Server Error",
  title: "Invalid npg body response"
});

export const buildRetrieveCardDataResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardData: { readonly jsonResponse: any; readonly sessionId: string }
): SessionPaymentMethodResponse => ({
  sessionId: cardData.sessionId,
  bin: cardData.jsonResponse.bin,
  expiringDate: cardData.jsonResponse.expiringDate,
  lastFourDigits: cardData.jsonResponse.lastFourDigits,
  brand: cardData.jsonResponse.circuit
});

export const buildCreateSessionResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessionResponse: { readonly jsonResponse: any; readonly orderId: string }
): CreateSessionResponse => ({
  orderId: sessionResponse.orderId,
  paymentMethodData: {
    paymentMethod: "CARDS",
    form: sessionResponse.jsonResponse.fields as ReadonlyArray<Field>
  }
});

export const createFormWithNpg: RequestHandler = async (_req, res) => {
  logger.info(
    `[Invoke NPG for create form using payment method id: ${_req.params.id}] - Return success case`
  );
  if (_req.query.recaptchaResponse == null) {
    logger.error("Missing recaptchaResponse query param!");
    res.status(404).send("Missing recaptchaResponse query param!");
    return;
  }

  const orderId = uuid().substring(0, 15);
  const postData = JSON.stringify({
    merchantUrl: `${_req.protocol}://${_req.get("Host")}`,
    order: {
      amount: "1000",
      currency: "EUR",
      orderId
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
        "X-Api-key": NPG_API_KEY
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
        { jsonResponse: resp, orderId },
        buildCreateSessionResponse,
        CreateSessionResponse.decode,
        E.mapLeft(e => {
          logger.error(formatValidationErrors(e));
          return res.status(500).send(internalServerError());
        }),
        E.map(val => {
          setSessionIdCookie(res, resp.sessionId);
          res.status(response.status).send(val);
        })
      );
    }),
    TE.mapLeft(() => res.status(500).send(internalServerError()))
  )();
};

export const retrieveCardDataFromNpg: RequestHandler = async (_req, res) => {
  if (_req.headers["x-transaction-id-from-client"] == null) {
    logger.info(
      "[Retrieve card data from NPG] - Return error case invalid x-transaction-id"
    );
    return res.status(401).send();
  }
  const orderId = _req.params.orderId;
  const sessionId = getSessionIdCookie(_req);
  logger.info(
    `[Retrieve card data from NPG with order id: ${orderId} npg-session id: ${sessionId}] - Return success case`
  );
  const correlationId = uuid();
  const url = `https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1/build/cardData?sessionId=${sessionId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Correlation-Id": correlationId,
      "X-Api-key": NPG_API_KEY
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
        { jsonResponse: resp, sessionId },
        buildRetrieveCardDataResponse,
        SessionPaymentMethodResponse.decode,
        E.mapLeft(() => res.status(502).send(internalServerError())),
        E.map(val => res.status(response.status).send(val))
      );
    }),
    TE.mapLeft(() => res.status(500).send(internalServerError()))
  )();
};
