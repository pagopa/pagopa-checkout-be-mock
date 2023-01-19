/* eslint-disable sort-keys */
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
import { authRequestVpos, authRequestXpay } from "./handlers/pgs";
import { FlowCase, setFlowCookie } from "./flow";

// eslint-disable-next-line max-lines-per-function
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

  app.get("/checkout/ecommerce/v1/carts/:id", async (_req, res) => {
    res.send({
      paymentNotices: [
        {
          noticeNumber: "302012387654312384",
          fiscalCode: "77777777777",
          amount: 1000,
          companyName: "test",
          description: "test"
        }
      ],
      returnUrls: {
        returnOkUrl: "www.comune.di.prova.it/pagopa/success.html",
        returnCancelUrl: "www.comune.di.prova.it/pagopa/cancel.html",
        returnErrorUrl: "www.comune.di.prova.it/pagopa/error.html"
      },
      emailNotice: "myemail@mail.it"
    });
  });

  // TODO refactoring to handle errors scenario
  app.get(
    "/checkout/ecommerce/v1/payment-requests/:rptid",
    async (_req, res) => {
      if (_req.params.rptid.substring(0, 11) !== "77777777777") {
        return res
          .status(404)
          .contentType("application/json")
          .send(
            '{"faultCodeCategory":"PAYMENT_UNKNOWN","faultCodeDetail":"PPT_DOMINIO_SCONOSCIUTO","title":"ValidationFault"}'
          );
      } else if (
        _req.params.rptid
          .substring(11, _req.params.rptid.length)
          .startsWith("30201")
      ) {
        return res
          .status(404)
          .contentType("application/json")
          .send(
            '{"faultCodeCategory":"PAYMENT_UNKNOWN","faultCodeDetail":"PPT_STAZIONE_INT_PA_SCONOSCIUTA","title":"ValidationFault"}'
          );
      } else {
        if (
          _req.params.rptid
            .substring(11, _req.params.rptid.length)
            .startsWith("30202")
        ) {
          logger.info("Nodo take in charge response flow activated");
          setFlowCookie(res, FlowCase.NODO_TAKEN_IN_CHARGE);
        } else {
          logger.info("OK flow activated");
          setFlowCookie(res, FlowCase.OK);
        }
        return res.send({
          amount: 12000,
          paymentContextCode: "a5560817eabc44ba877aaf4db96a606f",
          rptId: "77777777777302000100000009424",
          paFiscalCode: "77777777777",
          paName: "Pagamento di Test",
          description: "Pagamento di Test",
          dueDate: "2021-07-31"
        });
      }
    }
  );

  // TODO refactoring to handle errors scenario
  app.get("/checkout/ecommerce/v1/payment-methods", async (_req, res) => {
    res.send([
      {
        id: "3ebea7a1-2e77-4a1b-ac1b-3aca0d67f813",
        name: "Carte",
        description: "Carte",
        asset: "maestro",
        status: "ENABLED",
        paymentTypeCode: "CP",
        ranges: [{ min: 0, max: 999999 }]
      },
      {
        id: "1c23629f-8133-42f3-ad96-7e6527d27a43",
        name: "PostePay",
        description: "PostePay",
        asset: "maestro",
        status: "ENABLED",
        paymentTypeCode: "PPAY",
        ranges: [{ min: 0, max: 999999 }]
      }
    ]);
  });

  // payment-transaction-gateway xpay authorization requests mock
  app.get("/request-payments/xpay/:requestId", authRequestXpay);

  // payment-transaction-gateway vpos authorization requests mock
  app.get("/request-payments/vpos/:requestId", authRequestVpos);

  return app;
};
