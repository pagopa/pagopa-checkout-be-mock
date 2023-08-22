/* eslint-disable sort-keys */
import * as https from "https";
import { RequestHandler } from "express";
import { logger } from "../../logger";
import { createSuccessGetPaymentMethods } from "../../utils/ecommerce/payment-method";

export const ecommerceGetPaymentMethods: RequestHandler = async (req, res) => {
  logger.info("[Get payment-methods ecommerce] - Return success case");
  res.status(200).send(createSuccessGetPaymentMethods());
};

const { X_API_KEY } = process.env;

export const createFormWithNpg: RequestHandler = async (_req, res) => {
  logger.info(
    `[Get Payment Method preauthorization id: ${_req.params.id}] - Return success case`
  );
  const options = {
    headers: {
      "Content-Type": "application/json",
      "Correlation-Id": "df615d11-1159-43c9-bd07-fdc6f460e449",
      "X-Api-key": X_API_KEY
    },
    hostname: "stg-ta.nexigroup.com",
    maxRedirects: 20,
    method: "POST",
    path: "/api/phoenix-0.0/psp/api/v1/orders/build"
  };

  const build = https.request(options, response => {
    // eslint-disable-next-line functional/prefer-readonly-type
    const chunks: Uint8Array[] = [];

    response.on("data", chunk => {
      // eslint-disable-next-line functional/immutable-data
      chunks.push(chunk);
    });

    response.on("end", () => {
      const body = Buffer.concat(chunks);
      res.status(200).send(body);
    });

    response.on("error", error => {
      logger.error(error);
    });
  });
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

  build.write(postData);

  build.end();
};
