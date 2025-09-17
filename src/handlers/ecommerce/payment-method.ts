/* eslint-disable sort-keys */
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { v4 as uuid } from "uuid";
import { formatValidationErrors } from "io-ts-reporters";
import { logger } from "../../logger";
import {
  convertV1GetPaymentMethodsToV2,
  createSuccessGetPaymentMethods
} from "../../utils/ecommerce/payment-method";
import { CreateSessionResponse } from "../../generated/ecommerce/CreateSessionResponse";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { Field } from "../../generated/ecommerce/Field";
import { SessionPaymentMethodResponse } from "../../generated/ecommerce/SessionPaymentMethodResponse";
import { config } from "../../config";
import {
  FlowCase,
  getFlowCookie,
  getSessionIdCookie,
  setSessionIdCookie
} from "../../flow";
import { PaymentMethodsRequest } from "../../generated/ecommerce-v2/PaymentMethodsRequest";
import { error400BadRequest } from "../../utils/ecommerce/psp";
import { authService401 } from "./verify";

export const ecommerceGetPaymentMethods: RequestHandler = async (
  req,
  res,
  _next
) => {
  logger.info("[Get payment-methods ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPaymentMethods());
};

export const ecommerceGetPaymentMethodsV2: RequestHandler = async (
  req,
  res,
  _next
) => {
  logger.info("[Get payment-methods V2 ecommerce] - Return success case");
  return pipe(
    req.body,
    PaymentMethodsRequest.decode,
    E.fold(
      error => {
        logger.error(`Error decoding payment methods request`, error);
        return res.status(400).send(error400BadRequest());
      },
      () => res.status(200).send(convertV1GetPaymentMethodsToV2())
    )
  );
};

export const ecommerceGetPaymentMethodsV4: RequestHandler = async (
  req,
  res,
  _next
) => {
  logger.info("[Get payment-methods V2 ecommerce] - Return success case");
  return pipe(
    req.body,
    PaymentMethodsRequest.decode,
    E.map(_ => getFlowCookie(req)),
    E.filterOrElseW(
      flowCookie => flowCookie !== FlowCase.FAIL_UNAUTHORIZED_401,
      () => FlowCase.FAIL_UNAUTHORIZED_401
    ),
    E.fold(
      error => {
        if (error === FlowCase.FAIL_UNAUTHORIZED_401) {
          logger.info("Return unauthorized due to flow cookie");
          res.sendStatus(401);
        } else {
          logger.error("Error decoding payment methods request", error);
          res.status(400).send(error400BadRequest());
        }
      },
      _ => res.status(200).send(convertV1GetPaymentMethodsToV2())
    )
  );
};

export const secureEcommerceGetPaymentMethods: RequestHandler = async (
  req,
  res,
  _next
) => {
  if (getFlowCookie(req) === FlowCase.FAIL_UNAUTHORIZED_401) {
    logger.info("[Get payment-methods ecommerce] - Return error case 401");
    authService401(res);
  } else {
    ecommerceGetPaymentMethods(req, res, _next);
  }
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
  correlationId: uuid(),
  paymentMethodData: {
    paymentMethod: "CARDS",
    form: sessionResponse.jsonResponse.fields as ReadonlyArray<Field>
  }
});

export const createFormWithNpg: RequestHandler = async (_req, res, _next) => {
  logger.info(
    `[Invoke NPG for create form using payment method id: ${_req.params.id}] - Return success case`
  );
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

export const secureCreateFormWithNpg: RequestHandler = async (
  req,
  res,
  _next
) => {
  if (getFlowCookie(req) === FlowCase.FAIL_UNAUTHORIZED_401) {
    logger.info(
      `[Invoke NPG for create form using payment method id: ${req.params.id}] - Return error case 401`
    );
    authService401(res);
  } else {
    createFormWithNpg(req, res, _next);
  }
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
