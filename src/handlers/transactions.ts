import { pipe } from "fp-ts/function";
import { fold, map, right } from "fp-ts/Either";
import { RequestHandler } from "express";
import { encode3ds2MethodData, Transaction3DSStatus } from "../utils/3ds2";
import { TransactionStatus } from "../generated/payment_manager/TransactionStatus";
import { TransactionStatusResponse } from "../generated/payment_manager/TransactionStatusResponse";
import { sendResponseWithData, tupleWith } from "../utils/utils";

// eslint-disable-next-line functional/no-let
let transactionStatus: Transaction3DSStatus =
  Transaction3DSStatus.AwaitingMethod;

export const checkTransactionHandler: (idPayment: string) => RequestHandler = (
  idPayment: string
) => async (_req, res): Promise<void> => {
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
      idPayment,
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
      idPayment,
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
      idPayment,
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
      idPayment,
      idStatus: Transaction3DSStatus.AfterChallenge,
      idTransaction,
      paymentOrigin: "IO_PAY",
      statusMessage: "Ritornando dalla challenge 3ds2"
    },
    [Transaction3DSStatus.Confirmed]: {
      authorizationCode: "00",
      expired: false,
      finalStatus: true,
      idPayment,
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
    fold(_ => res.status(500).send(), sendResponseWithData)
  );
};

export const resume3ds2Handler: RequestHandler = async (_req, res) => {
  res.status(200).send();
};
