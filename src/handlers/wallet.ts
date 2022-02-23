import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { fold, map } from "fp-ts/Either";
import { RequestHandler } from "express";
import * as O from "fp-ts/Option";
import * as t from "io-ts";
import {
  ResponseErrorForbiddenAnonymousUser,
  ResponseErrorNotFound,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import { PathReporter } from "io-ts/PathReporter";
import { WalletRequest } from "../generated/payment_manager/WalletRequest";
import {
  createResponseWallet,
  createUpdateResponseWallet
} from "../utils/wallet";
import { CreditCard } from "../generated/payment_manager/CreditCard";
import { sendResponseWithData, tupleWith } from "../utils/utils";
import {
  EndpointController,
  EndpointHandler,
  HandlerResponseType,
  ResponseSuccessfulCreated
} from "../utils/types";
import { AddWalletUsingPOSTT } from "../generated/payment_manager/requestTypes";
import { WalletResponse } from "../generated/payment_manager/WalletResponse";
import { FlowCase, getFlowCookie } from "../flow";
import { logger } from "../logger";

// eslint-disable-next-line functional/no-let
let creditCard: CreditCard;

const addWalletController: (
  flowId: FlowCase
) => EndpointController<AddWalletUsingPOSTT> = flowId => (
  params
): HandlerResponseType<AddWalletUsingPOSTT> => {
  const responseWallet = createResponseWallet(params.walletRequest.data);
  creditCard = responseWallet.creditCard as CreditCard;

  const response: WalletResponse = {
    data: {
      creditCard,
      idWallet: responseWallet.idWallet,
      psp: responseWallet.psp,
      pspEditable: responseWallet.pspEditable,
      type: responseWallet.type
    }
  };

  const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
    [
      FlowCase.ANSWER_ADD_WALLET_STATUS_201,
      FlowCase.FAIL_ADD_WALLET_STATUS_403,
      FlowCase.FAIL_ADD_WALLET_STATUS_404
    ].includes(flow)
  );

  return pipe(
    isModifiedFlow(flowId),
    O.fold(
      () =>
        pipe(
          response,
          WalletResponse.decode,
          E.mapLeft<t.Errors, HandlerResponseType<AddWalletUsingPOSTT>>(e => {
            logger.info(
              PathReporter.report(E.left<t.Errors, WalletResponse>(e))
            );
            logger.warn(
              "PM `addWallet` endpoint doesn't have HTTP 400 responses, returning 201 on `WalletResponse` failed decoding instead"
            );
            return ResponseSuccessfulCreated;
          }),
          E.map(responseData => ({
            data: {
              ...responseData.data,
              psp: {
                ...responseData.data.psp,
                directAcquirer: false
              }
            }
          })),
          E.map(ResponseSuccessJson),
          E.getOrElse(t.identity)
        ),
      flow => {
        switch (flow) {
          case FlowCase.ANSWER_ADD_WALLET_STATUS_201:
            return ResponseSuccessfulCreated;
          case FlowCase.FAIL_ADD_WALLET_STATUS_403:
            return ResponseErrorForbiddenAnonymousUser;
          case FlowCase.FAIL_ADD_WALLET_STATUS_404:
            return ResponseErrorNotFound(
              `Mock – Failure case ${FlowCase[flow]}`,
              ""
            );
          default:
            throw new Error("Bug – Unhandled flow case");
        }
      }
    )
  );
};

export const addWalletHandler = (): EndpointHandler<AddWalletUsingPOSTT> => async (
  req
): Promise<HandlerResponseType<AddWalletUsingPOSTT>> => {
  const flowId = getFlowCookie(req);

  return pipe(
    req.body,
    WalletRequest.decode,
    // eslint-disable-next-line sonarjs/no-identical-functions
    E.mapLeft<t.Errors, HandlerResponseType<AddWalletUsingPOSTT>>(e => {
      logger.info(PathReporter.report(E.left<t.Errors, WalletResponse>(e)));
      logger.warn(
        "PM `addWallet` endpoint doesn't have HTTP 400 responses, returning 201 on `WalletResponse` failed decoding instead"
      );
      return ResponseSuccessfulCreated;
    }),
    E.map(walletRequest =>
      addWalletController(flowId)({
        Bearer: "",
        language: "",
        walletRequest
      })
    ),
    E.getOrElse(t.identity)
  );
};

export const updateWalletHandler: RequestHandler = async (req, res) => {
  pipe(
    WalletRequest.decode(req.body),
    map((requestData: WalletRequest) => {
      const sentWallet = requestData.data;

      return createUpdateResponseWallet(sentWallet, creditCard);
    }),
    map((responseWallet: Record<string, unknown>) => ({
      data: responseWallet
    })),
    tupleWith(res),
    fold(_e => res.status(500).send(), sendResponseWithData)
  );
};
