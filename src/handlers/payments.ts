import { pipe } from "fp-ts/function";
import { fold, map, right } from "fp-ts/Either";
import { RequestHandler } from "express";
import { PaymentResponse } from "../generated/payment_manager/PaymentResponse";
import { sendResponseWithData, tupleWith } from "../utils/utils";
import { TransactionResponse } from "../generated/payment_manager/TransactionResponse";
import { IUserData } from "../constants";

export const paymentCheckHandler: (
  idPayment: string,
  userData: IUserData
) => RequestHandler = (idPayment: string, userData: IUserData) => async (
  _req,
  res
): Promise<void> => {
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
            CCP: idPayment,
            IUV: "02016723749670000",
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: `${userData.name} ${userData.surname}`,
            tipoPagatore: "F"
          },
          {
            CCP: idPayment,
            IUV: "02016723749670000",
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "Comune di Milano",
            idDominio: "01199250158",
            importo: 20,
            nomePagatore: `${userData.name} ${userData.surname}`,
            tipoPagatore: "F"
          }
        ],
        fiscalCode: userData.fiscalCode,
        iban: "IT57N0760114800000011050036",
        id: 203436,
        idPayment,
        isCancelled: false,
        origin: "WALLET_APP",
        receiver: "EC_TE",
        // eslint-disable-next-line sonarjs/no-duplicate-string
        subject: "TARI/TEFA 2021",
        urlRedirectEc:
          "http://pagopamock.pagopa.hq/esito.php?idSession=e1283f0e673b4789a2af87fd9b4043f4"
      }
    }),
    map(PaymentResponse.encode),
    tupleWith(res),
    fold(_ => res.send(500), sendResponseWithData)
  );
};

export const pay3ds2Handler: (userData: IUserData) => RequestHandler = (
  userData: IUserData
) => async (_req, res): Promise<void> => {
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
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: `${userData.name} ${userData.surname}`,
            tipoPagatore: "F"
          },
          {
            CCP: "d15da8f4df1b4ab6855c966044310b1a",
            IUV: "02016723749670001",
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "Comune di Milano",
            idDominio: "01199250158",
            importo: 20,
            nomePagatore: `${userData.name} ${userData.surname}`,
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
    fold(_ => res.status(500).send(), sendResponseWithData)
  );
};

export const cancelPayment: RequestHandler = async (_req, res) => {
  res.status(200).send();
};

export const verifyPaymentHandler: (
  codiceContestoPagamento: string
) => RequestHandler = codiceContestoPagamento => async (
  _req,
  res
): Promise<void> => {
  res.status(200).send({
    causaleVersamento: "TARI/TEFA 2021",
    codiceContestoPagamento,
    enteBeneficiario: {
      denominazioneBeneficiario: "EC_TE",
      identificativoUnivocoBeneficiario: "77777777777"
    },
    ibanAccredito: "IT21Q0760101600000000546200",
    importoSingoloVersamento: 12000
  });
};

export const activatePaymentHandler: (
  codiceContestoPagamento: string
) => RequestHandler = codiceContestoPagamento => async (
  _req,
  res
): Promise<void> => {
  res.status(200).send({
    causaleVersamento: "TARI/TEFA 2021",
    codiceContestoPagamento,
    enteBeneficiario: {
      denominazioneBeneficiario: "EC_TE",
      identificativoUnivocoBeneficiario: "77777777777"
    },
    ibanAccredito: "IT21Q0760101600000000546200",
    importoSingoloVersamento: 12000
  });
};
