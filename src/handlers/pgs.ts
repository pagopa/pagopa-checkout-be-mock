import { RequestHandler } from "express";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import { identity } from "io-ts";
import { logger } from "../logger";
import {
  createNotFoundXPayPollingResponseEntity,
  createSuccessXPayPollingResponseEntity
} from "../utils/xpay";

export const authRequestXpay: RequestHandler = async (req, res) =>
  pipe(
    req.params.requestId,
    E.fromPredicate(id => id.startsWith("0"), identity),
    E.mapLeft(_ => {
      logger.info("[authRequestXpay] - Return error case");
      res.status(404).send(createNotFoundXPayPollingResponseEntity());
    }),
    E.map(_id => {
      logger.info("[authRequestXpay] - Return success case");
      res
        .status(200)
        .send(createSuccessXPayPollingResponseEntity(req.params.requestId));
    }),
    E.toUnion
  );
