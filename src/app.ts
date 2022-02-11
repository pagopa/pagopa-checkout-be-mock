import * as express from "express";
import {
  cancelPayment,
  pay3ds2Handler,
  paymentCheckHandler,
  paymentRequestHandler
} from "./handlers/payments";
import { approveTermsHandler, startSessionHandler } from "./handlers/users";
import { updateWalletHandler, walletHandler } from "./handlers/wallet";
import {
  checkTransactionHandler,
  resume3ds2Handler
} from "./handlers/transactions";
import { getPspListHandler } from "./handlers/psps";
import { ID_PAYMENT, SESSION_USER, USER_DATA } from "./constants";

export const newExpressApp: () => Promise<Express.Application> = async () => {
  const app = express();
  app.use(express.json());

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

  app.get(
    "/pp-restapi/v4/payments/:id/actions/check",
    paymentCheckHandler(ID_PAYMENT, USER_DATA)
  );

  app.post(
    "/pp-restapi/v4/users/actions/start-session",
    startSessionHandler(ID_PAYMENT, SESSION_USER)
  );

  app.post(
    "/pp-restapi/v4/users/actions/approve-terms",
    approveTermsHandler(SESSION_USER)
  );

  app.post("/pp-restapi/v4/wallet", walletHandler);

  app.post(
    "/pp-restapi/v4/payments/:id/actions/pay3ds2",
    pay3ds2Handler(USER_DATA)
  );

  app.get(
    "/pp-restapi/v4/transactions/:id/actions/check",
    checkTransactionHandler(ID_PAYMENT)
  );

  app.delete("/pp-restapi/v4/payments/:id/actions/delete", cancelPayment);

  app.post(
    "/pp-restapi/v4/transactions/:transactionData/actions/resume3ds2",
    resume3ds2Handler
  );

  app.get("/pp-restapi/v4/psps", getPspListHandler);

  app.put("/pp-restapi/v4/wallet/:id", updateWalletHandler);

  app.get(
    "/checkout/payments/v1/payment-requests/:rptId",
    paymentRequestHandler(ID_PAYMENT)
  );

  app.post(
    "/checkout/payments/v1/payment-activations",
    paymentRequestHandler(ID_PAYMENT)
  );

  app.get(
    "/checkout/payments/v1/payment-activations/:codiceContestoPagamento",
    async (_req, res) => {
      res.send({
        idPagamento: ID_PAYMENT
      });
    }
  );

  return app;
};
