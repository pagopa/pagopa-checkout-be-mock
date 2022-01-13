import * as express from "express";
import { PaymentResponse } from "./generated/api/PaymentResponse";

export const newExpressApp: () => Promise<Express.Application> = async () => {
  const app = express();
  app.use(express.json());

  app.set("port", 8080); // TODO: Use configuration instead of fixed value

  app.get("/payments/:id/actions/check", async (req, _res) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const id = Number.parseInt(req.params.id, 10);

    return {
      data: {
        amount: {
          amount: 12000,
          currency: "EUR",
          decimalDigits: 2
        },
        bolloDigitale: false,
        detailsList: [
          {
            CCP: "8bf0c08b67034dfcb700ff90d6aead78",
            IUV: "02000100000009133",
            codicePagatore: "JHNDOE00A01F205N",
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: "John Doe",
            tipoPagatore: "F"
          },
          {
            CCP: "8bf0c08b67034dfcb700ff90d6aead78",
            IUV: "02000100000009133",
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
        id: 203179,
        idPayment: "8bf0c08b67034dfcb700ff90d6aead78",
        isCancelled: false,
        origin: "IO_PAY",
        receiver: "EC_TE",
        subject: "TARI/TEFA 2021",
        urlRedirectEc:
          "http://pagopamock.pagopa.hq/esito.php?idSession=8bf0c08b67034dfcb700ff90d6aead78"
      }
    } as PaymentResponse;
  });

  return app;
};
