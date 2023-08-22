/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import nodeFetch from "node-fetch";
import { pipe } from "fp-ts/lib/function";
import { logger } from "../../logger";
import { createSuccessGetPaymentMethods } from "../../utils/ecommerce/payment-method";
import { createClient as createNpgClient } from "../../generated/ecommerce_npg_client/client";

export const ecommerceGetPaymentMethods: RequestHandler = async (req, res) => {
  logger.info("[Get payment-methods ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPaymentMethods());
};

export const npgClient = createNpgClient({
  baseUrl:
    "https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1/api/orders/build",
  fetchApi: (nodeFetch as any) as typeof fetch
});

export const createFormWithNpg: RequestHandler = async (req, res) => {
  pipe(() =>
    npgClient.apiordersbuild({
      ApiKeyAuth: "",
      "Correlation-Id": "",
      body: {
        merchantUrl: "https://localhost:1234",
        order: {
          amount: "0",
          currency: "EUR",
          orderId: "btid23838555"
        },
        paymentSession: {
          actionType: "VERIFY",
          amount: "0",
          cancelUrl: "https://checkout.pagopa/cancel",
          language: "ITA",
          notificationUrl: "https://merchanturl.it",
          paymentService: "CARDS",
          resultUrl: "https://checkout.pagopa.it/esito"
        },
        version: "2"
      }
    })
  );
};

/* export const createFormWithNpg: RequestHandler = async (req, res) => {
  const body = {
    body: {
      merchantUrl: "https://localhost:1234",
      order: {
        amount: "0",
        currency: "EUR",
        orderId: "btid23838555"
      },
      paymentSession: {
        actionType: "VERIFY",
        amount: "0",
        cancelUrl: "https://checkout.pagopa/cancel",
        language: "ITA",
        notificationUrl: "https://merchanturl.it",
        paymentService: "CARDS",
        resultUrl: "https://checkout.pagopa.it/esito"
      },
      version: "2"
    }
  };

  logger.info("[Create form payment-methods ecommerce] - Return success case");
  pipe(
    () =>
      fetch(
        "https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1/api/orders/build",
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        }
      ),
    O.map(result => result.json()),
    O.map(jsonformat => res.status(200).send(jsonformat))
  );
}; */
