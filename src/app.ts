import * as express from "express";
import { pipe } from "fp-ts/function";
import { chain, fold, map, right } from "fp-ts/Either";
import { createProxyMiddleware } from "http-proxy-middleware";
import { encode3ds2MethodData, Transaction3DSStatus } from "./3ds2";
import { PaymentResponse } from "./generated/api/PaymentResponse";
import { Session } from "./generated/api/Session";
import { TransactionResponse } from "./generated/api/TransactionResponse";
import { StatusEnum } from "./generated/api/User";
import { UserResponse } from "./generated/api/UserResponse";
import { WalletRequest } from "./generated/api/WalletRequest";
import { createResponseWallet } from "./wallet";
import { sendResponseWithData, tupleWith } from "./utils";
import { TransactionStatusResponse } from "./generated/api/TransactionStatusResponse";
import { TransactionStatus } from "./generated/api/TransactionStatus";
import { pspList } from "./psps";

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
    status: "ANONYMOUS" as StatusEnum,
    userId: 39624
  };

  // eslint-disable-next-line functional/no-let
  let transactionStatus: Transaction3DSStatus =
    Transaction3DSStatus.AwaitingMethod;

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
    pipe(
      right({
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
      }),
      map(PaymentResponse.encode),
      tupleWith(res),
      fold(_ => res.send(500), sendResponseWithData)
    );
  });

  app.post("/pp-restapi/v4/users/actions/start-session", async (_req, res) => {
    pipe(
      right({
        idPayment: ID_PAYMENT,
        sessionToken:
          "7c5G9d5o6W1v8p6S3a4z3N1c8q3A9p9c2M6p0v8D4t9c3G1s2c0N7w4o2K5o6q9P6i0p9H1d4z7G0a8n0L7a6n2J3c0n1S8h6j7G5w8u4G0s0b3U3x4n0V0d2m0E7m8e",
        user: {
          acceptTerms: true,
          ...SESSION_USER
        }
      }),
      map(Session.encode),
      tupleWith(res),
      fold(_e => res.status(500), sendResponseWithData)
    );
  });

  app.post("/pp-restapi/v4/users/actions/approve-terms", async (_req, res) => {
    pipe(
      right({
        data: SESSION_USER
      }),
      map(UserResponse.encode),
      tupleWith(res),
      fold(_e => res.status(500), sendResponseWithData)
    );
  });

  app.post("/pp-restapi/v4/wallet", async (req, res) =>
    pipe(
      WalletRequest.decode(req.body),
      chain((requestData: WalletRequest) => {
        const sentWallet = requestData.data;

        return createResponseWallet(sentWallet);
      }),
      map((responseWallet: unknown) => ({
        data: responseWallet
      })),
      tupleWith(res),
      fold(_e => res.status(500), sendResponseWithData)
    )
  );

  app.post("/pp-restapi/v4/payments/:id/actions/pay3ds2", async (_req, res) => {
    pipe(
      right({
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
      }),
      map(TransactionResponse.encode),
      tupleWith(res),
      fold(_ => res.status(500), sendResponseWithData)
    );
  });

  app.get(
    "/pp-restapi/v4/transactions/:id/actions/check",
    async (_req, res) => {
      const idTransaction = 7090106799;

      /* Here we skip all 3ds2 challenge verification steps and mock everything with a successful response */
      switch (transactionStatus) {
        case Transaction3DSStatus.AwaitingMethod: {
          transactionStatus = Transaction3DSStatus.AfterMethod;
          break;
        }
        case Transaction3DSStatus.AfterMethod: {
          transactionStatus = Transaction3DSStatus.Confirmed;
          break;
        }
        case Transaction3DSStatus.Confirmed: {
          transactionStatus = Transaction3DSStatus.AwaitingMethod;
          break;
        }
        case Transaction3DSStatus.AwaitingChallenge:
        case Transaction3DSStatus.AfterChallenge: {
          throw new Error(
            "BUG: Invalid state transition, 3DS challenge verification should be skipped."
          );
        }
        default: {
          throw new Error("BUG: Invalid `Transaction3DSStatus`");
        }
      }

      const RESPONSE_MAP: Record<Transaction3DSStatus, TransactionStatus> = {
        [Transaction3DSStatus.AwaitingMethod]: {
          authorizationCode: "25",
          expired: false,
          finalStatus: false,
          idPayment: ID_PAYMENT,
          idStatus: Transaction3DSStatus.AwaitingMethod,
          idTransaction,
          methodUrl: `http://localhost:8080/api/checkout/v1/transactions/${idTransaction}/method`,
          paymentOrigin: "IO_PAY",
          statusMessage: "In attesa del metodo 3ds2",
          threeDSMethodData: encode3ds2MethodData(idTransaction)
        },
        [Transaction3DSStatus.AfterMethod]: {
          authorizationCode: "25",
          expired: false,
          finalStatus: false,
          idPayment: ID_PAYMENT,
          idStatus: Transaction3DSStatus.AfterMethod,
          idTransaction,
          paymentOrigin: "IO_PAY",
          statusMessage: "In attesa del metodo 3ds2"
        },
        [Transaction3DSStatus.AwaitingChallenge]: {
          acsUrl:
            "https://3dstest.sia.eu/ACFS_3DS_ACS_GUI/brw/auth/main?TK=2FD85CB21D9D4482FF72533415D3C96067A31B2BDCE3BCF9952D8A15B3B7D1F65BE832BE1A709137",
          authorizationCode: "26",
          expired: false,
          finalStatus: false,
          idPayment: ID_PAYMENT,
          idStatus: Transaction3DSStatus.AwaitingChallenge,
          idTransaction,
          params: {
            creq:
              "eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJ0aHJlZURTU2VydmVyVHJhbnNJRCI6IjU0OGVjZWZmLTk5OTYtNGQ0NS05MmE4LTY4MTY5MjE1MjczMSIsImFjc1RyYW5zSUQiOiI4MWQzNWI3OS1lZGMyLTRlNGYtOTA5MC1hYWYwZTU4ZTFmYTUiLCJjaGFsbGVuZ2VXaW5kb3dTaXplIjoiMDUiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIn0"
          },
          paymentOrigin: "IO_PAY",
          statusMessage: "In attesa della challenge 3ds2"
        },
        [Transaction3DSStatus.AfterChallenge]: {
          authorizationCode: "26",
          expired: false,
          finalStatus: false,
          idPayment: ID_PAYMENT,
          idStatus: Transaction3DSStatus.AfterChallenge,
          idTransaction,
          paymentOrigin: "IO_PAY",
          statusMessage: "Ritornando dalla challenge 3ds2"
        },
        [Transaction3DSStatus.Confirmed]: {
          authorizationCode: "00",
          expired: false,
          finalStatus: true,
          idPayment: ID_PAYMENT,
          idStatus: Transaction3DSStatus.Confirmed,
          idTransaction,
          paymentOrigin: "IO_PAY",
          result: "OK",
          statusMessage: "Confermato"
        }
      };

      pipe(
        right({
          data: RESPONSE_MAP[transactionStatus]
        }),
        map(TransactionStatusResponse.encode),
        tupleWith(res),
        fold(_ => res.status(500), sendResponseWithData)
      );
    }
  );

  app.post(
    "/pp-restapi/v4/transactions/:transactionData/actions/resume3ds2",
    async (_req, res) => {
      res.status(200).send();
    }
  );

  app.get("/pp-restapi/v4/psps", async (req, res) => {
    const { listRequestedParam = "true" } = req.query;
    const listRequested = listRequestedParam === "true";

    if (!listRequested) {
      res.status(500);
      return;
    }

    res.send({
      data: pspList
    });
  });

  app.use(
    createProxyMiddleware("/api/checkout", {
      pathRewrite: {
        "^/api/checkout": "/api/"
      },
      target: "http://localhost:7071"
    })
  );

  return app;
};
