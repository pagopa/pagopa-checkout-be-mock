import * as https from "https";
import { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import { logger } from "../../logger";

const { X_API_KEY } = process.env;

const ecommercePaymentMethodpreauthorization: RequestHandler = async (
  _req,
  res
) => {
  logger.info(
    `[Get Payment Method Session, sessionID: ${encodeURIComponent(
      _req.params.sessionId
    )}] - Return success case`
  );
  const options = {
    headers: {
      "Content-Type": "application/json",
      "Correlation-Id": uuid(),
      "X-Api-key": X_API_KEY
    },
    hostname: "stg-ta.nexigroup.com",
    maxRedirects: 20,
    method: "GET",
    path: `/api/phoenix-0.0/psp/api/v1/build/cardData?sessionId=${encodeURIComponent(
      _req.params.sessionId
    )}`
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

  build.end();
};

export default ecommercePaymentMethodpreauthorization;
