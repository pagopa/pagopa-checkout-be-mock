/* eslint-disable sort-keys */
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { logger } from "../../logger";
import { createSuccessGetPaymentMethods } from "../../utils/ecommerce/payment-method";
import { CreateSessionResponse } from "../../generated/ecommerce_payment_methods/CreateSessionResponse";
import { ProblemJson } from "../../generated/ecommerce_payment_methods/ProblemJson";
import { Field } from "../../generated/ecommerce_payment_methods/Field";

export const ecommerceGetPaymentMethods: RequestHandler = async (req, res) => {
  logger.info("[Get payment-methods ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPaymentMethods());
};

const { X_API_KEY } = process.env;

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

  const response = await fetch(
    "https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1/orders/build",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Correlation-Id": "df615d11-1159-43c9-bd07-fdc6f460e449",
        "X-Api-key": X_API_KEY as string
      },
      body: postData
    }
  );

  const jsonResponse = await response.json();

  logger.info(
    `[Get Payment Method npg-session status code: ${response.status}]`
  );

  const data: CreateSessionResponse = {
    sessionId: jsonResponse.sessionId,
    fields: {
      paymentMethod: "CARD",
      form: jsonResponse.fields as ReadonlyArray<Field>
    }
  };

  pipe(
    data,
    CreateSessionResponse.decode,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    E.mapLeft(() => res.status(500).send(internalServerError())),
    E.map(resp => res.status(response.status).send(resp))
  );
};

export const internalServerError = (): ProblemJson => ({
  detail: "Internal Server Error",
  title: "Invalid npg body response"
});
