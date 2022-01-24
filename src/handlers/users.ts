import { pipe } from "fp-ts/function";
import { fold, map, right } from "fp-ts/Either";
import { RequestHandler } from "express";
import { UserResponse } from "../generated/api/UserResponse";
import { sendResponseWithData, tupleWith } from "../utils/utils";
import { Session } from "../generated/api/Session";
import { ISessionUser } from "../constants";

export const startSessionHandler: (
  idPayment: string,
  sessionUser: ISessionUser
) => RequestHandler = (
  idPayment: string,
  sessionUser: Record<string, unknown>
): RequestHandler => async (_req, res): Promise<void> => {
  pipe(
    right({
      idPayment,
      sessionToken:
        "7c5G9d5o6W1v8p6S3a4z3N1c8q3A9p9c2M6p0v8D4t9c3G1s2c0N7w4o2K5o6q9P6i0p9H1d4z7G0a8n0L7a6n2J3c0n1S8h6j7G5w8u4G0s0b3U3x4n0V0d2m0E7m8e",
      user: {
        acceptTerms: true,
        ...sessionUser
      }
    }),
    map(Session.encode),
    tupleWith(res),
    fold(_e => res.status(500).send(), sendResponseWithData)
  );
};

export const approveTermsHandler: (
  sessionUser: ISessionUser
) => RequestHandler = (sessionUser: ISessionUser) => async (
  _req,
  res
): Promise<void> => {
  pipe(
    right({
      data: sessionUser
    }),
    map(UserResponse.encode),
    tupleWith(res),
    fold(_e => res.status(500).send(), sendResponseWithData)
  );
};
