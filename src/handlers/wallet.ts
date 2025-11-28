/* eslint-disable @typescript-eslint/no-unused-vars, sort-keys */
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
import { WalletInfo } from "../generated/ecommerce-wallet/WalletInfo";
import { WalletInfoDetails } from "../generated/ecommerce-wallet/WalletInfoDetails";
import { WalletClient } from "../generated/ecommerce-wallet/WalletClient";
import { WalletApplicationInfo } from "../generated/ecommerce-wallet/WalletApplicationInfo";
import { WalletStatusEnum } from "../generated/ecommerce-wallet/WalletStatus";
import { WalletClientStatusEnum } from "../generated/ecommerce-wallet/WalletClientStatus";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars, sort-keys
const mockWallets: ReadonlyArray<WalletInfo> = [
  {
    walletId: "11111111-1111-1111-1111-111111111111",
    paymentMethodId: "pm_1",
    paymentMethodAsset: "http://logo.cdn/brandLogo1",
    status: WalletStatusEnum.VALIDATED,
    creationDate: new Date(),
    updateDate: new Date(),
    applications: [{ name: "APP1", status: "ENABLED" }] as ReadonlyArray<
      WalletApplicationInfo
    >,
    clients: {
      IO: { status: WalletClientStatusEnum.ENABLED }
    },
    details: {
      type: "CARDS",
      brand: "VISA",
      lastFourDigits: "1234",
      expiryDate: "203012"
    } as WalletInfoDetails
  },
  {
    walletId: "22222222-2222-2222-2222-222222222222",
    paymentMethodId: "pm_2",
    paymentMethodAsset: "http://logo.cdn/brandLogo2",
    status: WalletStatusEnum.VALIDATED,
    creationDate: new Date(),
    updateDate: new Date(),
    applications: [{ name: "APP2", status: "DISABLED" }] as ReadonlyArray<
      WalletApplicationInfo
    >,
    clients: {
      IO: { status: WalletClientStatusEnum.DISABLED }
    },
    details: {
      type: "PAYPAL",
      pspId: "psp_123",
      pspBusinessName: "PayPal Business",
      maskedEmail: "test***@***test.it"
    } as WalletInfoDetails
  },
  {
    walletId: "33333333-3333-3333-3333-333333333333",
    paymentMethodId: "pm_3",
    paymentMethodAsset: "http://logo.cdn/brandLogo3",
    status: WalletStatusEnum.VALIDATED,
    creationDate: new Date(),
    updateDate: new Date(),
    applications: [{ name: "APP3", status: "ENABLED" }] as ReadonlyArray<
      WalletApplicationInfo
    >,
    clients: {
      IO: { status: WalletClientStatusEnum.ENABLED }
    },
    details: {
      type: "CARDS",
      brand: "MASTERCARD",
      lastFourDigits: "5678",
      expiryDate: "202406"
    } as WalletInfoDetails
  },
  {
    walletId: "44444444-4444-4444-4444-444444444444",
    paymentMethodId: "pm_4",
    paymentMethodAsset: "http://logo.cdn/brandLogo4",
    status: WalletStatusEnum.VALIDATED,
    creationDate: new Date(),
    updateDate: new Date(),
    applications: [{ name: "APP4", status: "DISABLED" }] as ReadonlyArray<
      WalletApplicationInfo
    >,
    clients: {
      IO: { status: WalletClientStatusEnum.DISABLED }
    },
    details: {
      type: "PAYPAL",
      pspId: "psp_456",
      pspBusinessName: "PayPal Enterprise",
      maskedEmail: "demo***@***demo.it"
    } as WalletInfoDetails
  }
];

export const ecommerceGetWallets: RequestHandler = async (_req, res) => {
  logger.info("GET WALLLETS ");
  res.json({ wallets: mockWallets });
};
