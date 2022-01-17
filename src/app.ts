import * as express from "express";
import { PaymentResponse } from "./generated/api/PaymentResponse";
import { Session } from "./generated/api/Session";
import { User } from "./generated/api/User";
import { UserResponse } from "./generated/api/UserResponse";
import { WalletRequest } from "./generated/api/WalletRequest";
import { WalletResponse } from "./generated/api/WalletResponse";
import { createResponseWallet } from "./wallet";

// eslint-disable-next-line max-lines-per-function
export const newExpressApp: () => Promise<Express.Application> = async () => {
  const app = express();
  app.use(express.json());

  const USER_DATA = {
    cellphone: "+39 333 3333333",
    email: "john.doe@gmail.com",
    fiscalCode: "JHNDOE00A01F205N",
    name: "John",
    surname: "Doe"
  };

  const ID_PAYMENT = "e1283f0e673b4789a2af87fd9b4043f4";

  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Authorization, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", ["GET", "POST"]);
    next();
  });

  app.get("/getPaymentId", async (_req, res) => {
    res.status(200).send({
      idPayment: ID_PAYMENT
    });
  });

  app.get("/pp-restapi/v4/payments/:id/actions/check", async (_req, res) => {
    res.status(200).send({
      data: {
        amount: {
          amount: 12000,
          currency: "EUR",
          decimalDigits: 2
        },
        bolloDigitale: false,
        detailsList: [
          {
            CCP: ID_PAYMENT,
            IUV: "02016723749670000",
            codicePagatore: USER_DATA.fiscalCode,
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: `${USER_DATA.name} ${USER_DATA.surname}`,
            tipoPagatore: "F"
          },
          {
            CCP: ID_PAYMENT,
            IUV: "02016723749670000",
            codicePagatore: USER_DATA.fiscalCode,
            enteBeneficiario: "Comune di Milano",
            idDominio: "01199250158",
            importo: 20,
            nomePagatore: `${USER_DATA.name} ${USER_DATA.surname}`,
            tipoPagatore: "F"
          }
        ],
        fiscalCode: USER_DATA.fiscalCode,
        iban: "IT57N0760114800000011050036",
        id: 203436,
        idPayment: ID_PAYMENT,
        isCancelled: false,
        origin: "WALLET_APP",
        receiver: "EC_TE",
        subject: "TARI/TEFA 2021",
        urlRedirectEc:
          "http://pagopamock.pagopa.hq/esito.php?idSession=e1283f0e673b4789a2af87fd9b4043f4"
      }
    } as PaymentResponse);
  });

  app.post("/pp-restapi/v4/users/actions/start-session", async (_req, res) => {
    res.status(200);
    // TODO: check this
    res.send({
      idPayment: ID_PAYMENT,
      sessionToken: ID_PAYMENT,
      user: {
        acceptTerms: true,
        activationDate: new Date("2022-01-14T16:15:29.362Z"),
        cellphone: USER_DATA.cellphone,
        email: USER_DATA.email,
        fiscalCode: USER_DATA.fiscalCode,
        idPayment: ID_PAYMENT,
        name: USER_DATA.name,
        notificationEmail: USER_DATA.email,
        registered: false,
        registeredDate: new Date("2022-01-14T16:15:29.362Z"),
        spidSessionId: 0,
        status: "ANONYMOUS",
        surname: USER_DATA.surname,
        userId: 0,
        username: undefined
      } as User
    } as Session);
  });

  app.post("/pp-restapi/v4/users/actions/approve-terms", async (_req, res) => {
    res.status(200);
    res.send({
      data: {
        acceptTerms: true,
        activationDate: new Date("2022-01-14T16:30:47.534Z"),
        cellphone: USER_DATA.cellphone,
        email: USER_DATA.email,
        fiscalCode: USER_DATA.fiscalCode,
        idPayment: ID_PAYMENT,
        name: USER_DATA.name,
        notificationEmail: USER_DATA.email,
        registered: true,
        registeredDate: new Date("2022-01-14T16:30:47.534Z"),
        spidSessionId: 0,
        status: "ANONYMOUS",
        surname: USER_DATA.surname,
        userId: 0,
        username: undefined
      }
    } as UserResponse);
  });

  app.post("/pp-restapi/v4/wallet", async (req, res) => {
    const requestData = req.body as WalletRequest;
    const sentWallet = requestData.data;

    const responseWallet = createResponseWallet(sentWallet);

    res.status(200);
    res.send({
      data: responseWallet
    } as WalletResponse);
  });

  app.get(
    "/api/checkout/payments/v1/browsers/current/info",
    async (_req, res) => {
      res.send({
        accept: "*/*",
        ip: "97.13.428.11",
        useragent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0"
      });
    }
  );

  return app;
};
