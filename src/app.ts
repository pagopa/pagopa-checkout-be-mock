import * as express from "express";
import { PaymentResponse } from "./generated/api/PaymentResponse";

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
      "Origin, X-Requested-With, Content-Type, Accept"
    );
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

  return app;
};
