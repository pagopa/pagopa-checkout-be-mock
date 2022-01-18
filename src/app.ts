import * as express from "express";
import { encode3ds2MethodData } from "./3ds2";
import { PaymentResponse } from "./generated/api/PaymentResponse";
import { Session } from "./generated/api/Session";
import { TransactionResponse } from "./generated/api/TransactionResponse";
import { User } from "./generated/api/User";
import { UserResponse } from "./generated/api/UserResponse";
import { WalletRequest } from "./generated/api/WalletRequest";
import { WalletResponse } from "./generated/api/WalletResponse";
import { createResponseWallet } from "./wallet";

// eslint-disable-next-line max-lines-per-function
export const newExpressApp: () => Promise<Express.Application> = async () => {
  const app = express();
  app.use(express.json());

  const ID_PAYMENT = "e1283f0e673b4789a2af87fd9b4043f4";

  const USER_DATA = {
    cellphone: "+39 333 3333333",
    email: "john.doe@gmail.com",
    fiscalCode: "JHNDOE00A01F205N",
    name: "John",
    surname: "Doe"
  };

  const SESSION_USER = {
    email: USER_DATA.email,
    fiscalCode: USER_DATA.fiscalCode,
    notificationEmail: USER_DATA.email,
    registered: false,
    status: "ANONYMOUS",
    userId: 39624
  };

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

    res.send({
      idPayment: ID_PAYMENT,
      sessionToken:
        "7c5G9d5o6W1v8p6S3a4z3N1c8q3A9p9c2M6p0v8D4t9c3G1s2c0N7w4o2K5o6q9P6i0p9H1d4z7G0a8n0L7a6n2J3c0n1S8h6j7G5w8u4G0s0b3U3x4n0V0d2m0E7m8e",
      user: {
        acceptTerms: true,
        ...SESSION_USER
      } as User
    } as Session);
  });

  app.post("/pp-restapi/v4/users/actions/approve-terms", async (_req, res) => {
    res.status(200);
    res.send({
      data: SESSION_USER
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

  app.post("/pp-restapi/v4/payments/:id/actions/pay3ds2", async (_req, res) => {
    res.send({
      data: {
        amount: {
          amount: 12000,
          currency: "EUR",
          decimalDigits: 2
        },
        created: new Date("2022-01-17T15:00:20Z"),
        description: "TARI/TEFA 2021",
        detailsList: [
          {
            CCP: "d15da8f4df1b4ab6855c966044310b1a",
            IUV: "02016723749670001",
            codicePagatore: USER_DATA.fiscalCode,
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: `${USER_DATA.name} ${USER_DATA.surname}`,
            tipoPagatore: "F"
          },
          {
            CCP: "d15da8f4df1b4ab6855c966044310b1a",
            IUV: "02016723749670001",
            codicePagatore: USER_DATA.fiscalCode,
            enteBeneficiario: "Comune di Milano",
            idDominio: "01199250158",
            importo: 20,
            nomePagatore: `${USER_DATA.name} ${USER_DATA.surname}`,
            tipoPagatore: "F"
          }
        ],
        directAcquirer: false,
        error: false,
        fee: {
          amount: 100,
          currency: "EUR",
          decimalDigits: 2
        },
        grandTotal: {
          amount: 12100,
          currency: "EUR",
          decimalDigits: 2
        },
        id: 7090106732,
        idPayment: 203737,
        idStatus: 0,
        idWallet: 94243,
        merchant: "EC_TE",
        nodoIdPayment: "d15da8f4df1b4ab6855c966044310b1a",
        orderNumber: 7090106732,
        paymentCancelled: false,
        paymentModel: 0,
        pspId: 1122602,
        pspInfo: {
          codiceAbi: "03069",
          idPsp: "BCITITMM",
          ragioneSociale: "Intesa Sanpaolo S.p.A"
        },
        statusMessage: "Da autorizzare",
        success: false,
        token: "NzA5MDEwNjczMg==",
        updated: new Date("2022-01-17T15:00:20Z"),
        urlCheckout3ds:
          "https://acardste.vaservices.eu/wallet/checkout?id=NzA5MDEwNjczMg=="
      }
    } as TransactionResponse);
  });

  app.get(
    "/pp-restapi/v4/transactions/:id/actions/check",
    async (_req, res) => {
      const idTransaction = 7090106799;
      res.send({
        data: {
          authorizationCode: "25",
          expired: false,
          finalStatus: false,
          idPayment: ID_PAYMENT,
          idStatus: 15,
          idTransaction,
          methodUrl: "https://3dstest.sia.eu/ACFS_3DS_ACS_GUI/brw/gdi/main",
          paymentOrigin: "IO_PAY",
          statusMessage: "In attesa del metodo 3ds2",
          threeDSMethodData: encode3ds2MethodData(idTransaction)
        }
      });
    }
  );

  return app;
};
