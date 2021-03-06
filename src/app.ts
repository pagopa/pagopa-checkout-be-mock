import * as express from "express";
import { toExpressHandler } from "@pagopa/ts-commons/lib/express";
import * as cookieParser from "cookie-parser";
// import { createProxyMiddleware } from "http-proxy-middleware";
import { ResponseErrorInternal } from "@pagopa/ts-commons/lib/responses";
import {
  activatePaymentHandler,
  cancelPayment,
  checkPaymentStatusHandler,
  getPaymentInfoHandler,
  pay3ds2Handler,
  paymentCheckHandler
} from "./handlers/payments";
import { approveTermsHandler, startSessionHandler } from "./handlers/users";
import { addWalletHandler, updateWalletHandler } from "./handlers/wallet";
import {
  checkTransactionHandler,
  resume3ds2Handler
} from "./handlers/transactions";
import { getPspListHandler } from "./handlers/psps";
import { ID_PAYMENT, SESSION_USER, USER_DATA } from "./constants";
import { logger } from "./logger";

export const newExpressApp: () => Promise<Express.Application> = async () => {
  const app = express();
  const router = express.Router();

  app.use(express.json());
  app.use(cookieParser());

  app.use("/checkout/*", async (req, res: express.Response, next) => {
    const oldJson = res.json;

    // eslint-disable-next-line functional/immutable-data
    res.json = (
      body: Record<string, unknown>
    ): express.Response<Record<string, unknown>> => {
      try {
        const originalResponseBody = body;

        if (
          [404, 409, 502, 503, 504].includes(res.statusCode) &&
          originalResponseBody.detail_v2 !== null
        ) {
          res.status(400);

          const response = {
            detail: originalResponseBody.detail_v2,
            status: 400,
            title: originalResponseBody.title
          };

          return oldJson.call(res, response);
        } else {
          return oldJson.call(res, originalResponseBody);
        }
      } catch (e) {
        return oldJson.call(res, body);
      }
    };
    next();
  });

  app.use((req, res, next) => {
    setTimeout(next, Number(process.env.ENDPOINT_DELAY));
  });

  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Authorization, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ]);
    next();
  });

  app.get("/getPaymentId", async (_req, res) => {
    res.status(200).send({
      idPayment: ID_PAYMENT
    });
  });

  app.use(router);

  router.get(
    "/pp-restapi/v4/payments/:id/actions/check",
    paymentCheckHandler(ID_PAYMENT, USER_DATA)
  );

  router.post(
    "/pp-restapi/v4/users/actions/start-session",
    toExpressHandler(startSessionHandler(ID_PAYMENT, SESSION_USER))
  );

  router.post(
    "/pp-restapi/v4/users/actions/approve-terms",
    toExpressHandler(approveTermsHandler(SESSION_USER))
  );

  router.post("/pp-restapi/v4/wallet", toExpressHandler(addWalletHandler()));

  router.post(
    "/pp-restapi/v4/payments/:id/actions/pay3ds2",
    toExpressHandler(pay3ds2Handler(USER_DATA))
  );

  router.get(
    "/pp-restapi/v4/transactions/:id/actions/check",
    toExpressHandler(checkTransactionHandler(ID_PAYMENT))
  );

  router.delete("/pp-restapi/v4/payments/:id/actions/delete", cancelPayment);

  router.post(
    "/pp-restapi/v4/transactions/:transactionData/actions/resume3ds2",
    resume3ds2Handler
  );

  router.get("/pp-restapi/v4/psps", getPspListHandler);

  router.put("/pp-restapi/v4/wallet/:id", updateWalletHandler);

  app.get(
    "/checkout/payments/v1/payment-requests/:rptId",
    async (req, res, _next) => {
      try {
        return await getPaymentInfoHandler(ID_PAYMENT)(req, res);
      } catch (e) {
        logger.error("Got error while executing request handler:");
        logger.error(e);
        return ResponseErrorInternal("").apply(res);
      }
    }
  );

  app.post(
    "/checkout/payments/v1/payment-activations",
    toExpressHandler(activatePaymentHandler())
  );

  app.get(
    "/checkout/payments/v1/payment-activations/:codiceContestoPagamento",
    toExpressHandler(checkPaymentStatusHandler(ID_PAYMENT))
  );

  // app.use(
  //   createProxyMiddleware("/checkout/payment-transactions", {
  //     onProxyReq: (proxyReq, _req, _res) => {
  // eslint-disable-next-line extra-rules/no-commented-out-code
  //       proxyReq.setHeader("X-Forwarded-For", "127.0.0.1");
  //     },
  //     pathRewrite: {
  //       "^/checkout/payment-transactions": "/api"
  //     },
  //     target: `http://${process.env.PAGOPA_FUNCTIONS_CHECKOUT_HOST}:${process.env.PAGOPA_FUNCTIONS_CHECKOUT_PORT}`
  //   })
  // );
  app.get(
    "/checkout/payment-transactions/v1/browsers/current/info",
    async (_req, res) => {
      res.send({
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        ip: "127.0.0.1",
        useragent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36"
      });
    }
  );

  return app;
};
