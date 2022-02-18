import { pipe } from "fp-ts/function";
import { fold, map } from "fp-ts/Either";
import { RequestHandler } from "express";
import { WalletRequest } from "../generated/payment_manager/WalletRequest";
import {
  createResponseWallet,
  createUpdateResponseWallet
} from "../utils/wallet";
import { CreditCard } from "../generated/payment_manager/CreditCard";
import { sendResponseWithData, tupleWith } from "../utils/utils";

// eslint-disable-next-line functional/no-let
let creditCard: CreditCard;

export const walletHandler: RequestHandler = async (req, res) =>
  pipe(
    WalletRequest.decode(req.body),
    map((requestData: WalletRequest) => {
      const sentWallet = requestData.data;

      return createResponseWallet(sentWallet);
    }),
    map((responseWallet: Record<string, unknown>) => {
      creditCard = responseWallet.creditCard as CreditCard;
      return responseWallet;
    }),
    map((responseWallet: unknown) => ({
      data: responseWallet
    })),
    tupleWith(res),
    fold(_e => res.status(500).send(), sendResponseWithData)
  );

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
