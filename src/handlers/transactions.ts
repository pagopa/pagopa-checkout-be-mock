import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { RequestHandler } from "express";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import {
  ResponseErrorInternal,
  ResponseErrorNotFound,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import * as O from "fp-ts/Option";
import { encode3ds2MethodData, Transaction3DSStatus } from "../utils/3ds2";
import { TransactionStatus } from "../generated/payment_manager/TransactionStatus";
import { TransactionStatusResponse } from "../generated/payment_manager/TransactionStatusResponse";

import {
  EndpointController,
  EndpointHandler,
  HandlerResponseType,
  ResponseUnprocessableEntity
} from "../utils/types";
import { CheckStatusUsingGETT } from "../generated/payment_manager/requestTypes";
import { logger } from "../logger";
import { FlowCase, getFlowCookie } from "../flow";

// eslint-disable-next-line functional/no-let
let transactionStatus: Transaction3DSStatus =
  Transaction3DSStatus.AwaitingMethod;

const checkTransactionController: (
  idPayment: string,
  flowId: FlowCase
) => EndpointController<CheckStatusUsingGETT> = (idPayment, flowId) => (
  _params
): HandlerResponseType<CheckStatusUsingGETT> => {
  const idTransaction = 7090106799;

  /* Here we skip all 3ds2 challenge verification steps and mock everything with a successful response */
  /* Cut away confirmed for test purpose */
  switch (transactionStatus) {
    case Transaction3DSStatus.AwaitingMethod: {
      transactionStatus = Transaction3DSStatus.AfterMethod;
      break;
    }
    case Transaction3DSStatus.AfterMethod: {
      transactionStatus = Transaction3DSStatus.AcceptedNodoTimeout;
      break;
    }
    case Transaction3DSStatus.Confirmed: {
      transactionStatus = Transaction3DSStatus.AwaitingMethod;
      break;
    }
    case Transaction3DSStatus.AcceptedNodoTimeout: {
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
    },
    [Transaction3DSStatus.AcceptedNodoTimeout]: {
      authorizationCode: "00",
      expired: false,
      finalStatus: true,
      idPayment,
      idStatus: Transaction3DSStatus.AcceptedNodoTimeout,
      idTransaction,
      paymentOrigin: "IO_PAY",
      result: "OK",
      statusMessage: "Autorizzato"
    }
  };

  const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
    [
      FlowCase.FAIL_CHECK_STATUS_404,
      FlowCase.FAIL_CHECK_STATUS_422,
      FlowCase.FAIL_CHECK_STATUS_500
    ].includes(flow)
  );

  return pipe(
    isModifiedFlow(flowId),
    O.fold(
      () =>
        pipe(
          {
            data: RESPONSE_MAP[transactionStatus]
          },
          TransactionStatusResponse.decode,
          E.mapLeft<t.Errors, HandlerResponseType<CheckStatusUsingGETT>>(e => {
            logger.info(
              PathReporter.report(
                E.left<t.Errors, TransactionStatusResponse>(e)
              )
            );
            logger.warn(
              "PM `checkStatusUsingGet` endpoint doesn't have HTTP 400 responses, returning 422 on `TransactionStatusResponse` failed decoding instead"
            );
            return ResponseUnprocessableEntity;
          }),
          E.map(ResponseSuccessJson),
          E.getOrElse(t.identity)
        ),
      flow => {
        switch (flow) {
          case FlowCase.FAIL_CHECK_STATUS_404:
            return ResponseErrorNotFound(
              `Mock – Failure case ${FlowCase[flow]}`,
              ""
            );
          case FlowCase.FAIL_CHECK_STATUS_422:
            return ResponseUnprocessableEntity;
          case FlowCase.FAIL_CHECK_STATUS_500:
            return ResponseErrorInternal(
              `Mock – Failure case ${FlowCase[flow]}`
            );
          default:
            throw new Error("Bug – Unhandled flow case");
        }
      }
    )
  );
};

export const checkTransactionHandler: (
  idPayment: string
) => EndpointHandler<CheckStatusUsingGETT> = (idPayment: string) => async (
  req
): Promise<HandlerResponseType<CheckStatusUsingGETT>> => {
  const flowId = getFlowCookie(req);

  return pipe(req.params.id, id =>
    checkTransactionController(
      idPayment,
      flowId
    )({
      Bearer: "",
      id
    })
  );
};

export const resume3ds2Handler: RequestHandler = async (_req, res) => {
  res.status(200).send();
};
