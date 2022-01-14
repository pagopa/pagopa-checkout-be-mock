import * as express from "express";
import { PaymentResponse } from "./generated/api/PaymentResponse";

export const newExpressApp: () => Promise<Express.Application> = async () => {
  const app = express();
  app.use(express.json());

  app.get("/getPaymentId", async (_req, res) => {
    res.status(200).send({
      idPayment: "e1283f0e673b4789a2af87fd9b4043f4"
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
            CCP: "e1283f0e673b4789a2af87fd9b4043f4",
            IUV: "02016723749670000",
            codicePagatore: "JHNDOE00A01F205N",
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: "John Doe",
            tipoPagatore: "F"
          },
          {
            CCP: "e1283f0e673b4789a2af87fd9b4043f4",
            IUV: "02016723749670000",
            codicePagatore: "JHNDOE00A01F205N",
            enteBeneficiario: "Comune di Milano",
            idDominio: "01199250158",
            importo: 20,
            nomePagatore: "John Doe",
            tipoPagatore: "F"
          }
        ],
        fiscalCode: "JHNDOE00A01F205N",
        iban: "IT57N0760114800000011050036",
        id: 203436,
        idPayment: "e1283f0e673b4789a2af87fd9b4043f4",
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
