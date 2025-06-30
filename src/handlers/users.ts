import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import {
  ResponseErrorForbiddenAnonymousUser,
  ResponseErrorInternal,
  ResponseErrorNotFound,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import * as t from "io-ts";
import * as O from "fp-ts/Option";
import { PathReporter } from "io-ts/PathReporter";
import { UserResponse } from "../generated/payment_manager/UserResponse";
import { ISessionUser } from "../constants";
import {
  ApproveTermsUsingPOSTT,
  StartSessionUsingPOSTT
} from "../generated/payment_manager/requestTypes";
import { StartSessionRequest } from "../generated/payment_manager/StartSessionRequest";
import {
  EndpointController,
  EndpointHandler,
  HandlerResponseType,
  ResponseSuccessfulCreated,
  ResponseUnauthorized,
  ResponseUnprocessableEntity
} from "../utils/types";
import { Session } from "../generated/payment_manager/Session";
import { FlowCase, getFlowCookie } from "../flow";
import { logger } from "../logger";
import { ApproveTermsRequest } from "../generated/payment_manager/ApproveTermsRequest";

export const startSessionController: (
  idPayment: string,
  sessionUser: ISessionUser,
  flowId: FlowCase
) => EndpointController<StartSessionUsingPOSTT> = (
  idPayment,
  sessionUser,
  flowId
) => (_params): HandlerResponseType<StartSessionUsingPOSTT> => {
  const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
    [
      FlowCase.ANSWER_START_SESSION_STATUS_201,
      FlowCase.FAIL_START_SESSION_STATUS_401,
      FlowCase.FAIL_START_SESSION_STATUS_403,
      FlowCase.FAIL_START_SESSION_STATUS_404,
      FlowCase.FAIL_START_SESSION_STATUS_422,
      FlowCase.FAIL_START_SESSION_STATUS_500
    ].includes(flow)
  );

  const response: Session = {
    idPayment,
    sessionToken:
      "7c5G9d5o6W1v8p6S3a4z3N1c8q3A9p9c2M6p0v8D4t9c3G1s2c0N7w4o2K5o6q9P6i0p9H1d4z7G0a8n0L7a6n2J3c0n1S8h6j7G5w8u4G0s0b3U3x4n0V0d2m0E7m8e",
    user: {
      ...sessionUser
    }
  };

  return pipe(
    isModifiedFlow(flowId),
    O.fold(
      () =>
        pipe(
          response,
          Session.decode,
          E.mapLeft<t.Errors, HandlerResponseType<StartSessionUsingPOSTT>>(
            e => {
              logger.info(PathReporter.report(E.left<t.Errors, Session>(e)));
              logger.warn(
                "PM `startSession` endpoint doesn't have HTTP 400 responses, returning 422 on `Session` failed decoding instead"
              );
              return ResponseUnprocessableEntity;
            }
          ),
          E.map(ResponseSuccessJson),
          E.getOrElse(t.identity)
        ),
      flow => {
        switch (flow) {
          case FlowCase.ANSWER_START_SESSION_STATUS_201:
            return ResponseSuccessfulCreated;
          case FlowCase.FAIL_START_SESSION_STATUS_401:
            return ResponseUnauthorized;
          case FlowCase.FAIL_START_SESSION_STATUS_403:
            return ResponseErrorForbiddenAnonymousUser;
          case FlowCase.FAIL_START_SESSION_STATUS_404:
            return ResponseErrorNotFound(
              `Mock – Failure case ${FlowCase[flow]}`,
              ""
            );
          case FlowCase.FAIL_START_SESSION_STATUS_422:
            return ResponseUnprocessableEntity;
          case FlowCase.FAIL_START_SESSION_STATUS_500:
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

export const startSessionHandler = (
  idPayment: string,
  sessionUser: ISessionUser
): EndpointHandler<StartSessionUsingPOSTT> => async (
  req
): Promise<HandlerResponseType<StartSessionUsingPOSTT>> => {
  const flowId = getFlowCookie(req);

  return pipe(
    req.body,
    StartSessionRequest.decode,
    E.mapLeft<t.Errors, HandlerResponseType<StartSessionUsingPOSTT>>(e => {
      logger.info(
        PathReporter.report(E.left<t.Errors, StartSessionRequest>(e))
      );
      logger.warn(
        "PM `startSession` endpoint doesn't have HTTP 400 responses, returning 422 on `StartSessionRequest` failed decoding instead"
      );
      return ResponseUnprocessableEntity;
    }),
    E.map(startSessionRequest =>
      startSessionController(
        idPayment,
        sessionUser,
        flowId
      )({ startSessionRequest })
    ),
    E.getOrElse(t.identity)
  );
};

const approveTermsController: (
  sessionUser: ISessionUser,
  flowId: FlowCase
) => EndpointController<ApproveTermsUsingPOSTT> = (sessionUser, flowId) => (
  _params
): HandlerResponseType<ApproveTermsUsingPOSTT> => {
  const response: UserResponse = sessionUser;

  const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
    [
      FlowCase.FAIL_APPROVE_TERMS_STATUS_404,
      FlowCase.FAIL_APPROVE_TERMS_STATUS_422,
      FlowCase.FAIL_APPROVE_TERMS_STATUS_500
    ].includes(flow)
  );

  return pipe(
    isModifiedFlow(flowId),
    O.fold(
      () =>
        pipe(
          response,
          UserResponse.decode,
          E.mapLeft<t.Errors, HandlerResponseType<ApproveTermsUsingPOSTT>>(
            e => {
              logger.info(
                PathReporter.report(E.left<t.Errors, UserResponse>(e))
              );
              logger.warn(
                "PM `approveTerms` endpoint doesn't have HTTP 400 responses, returning 422 on `UserResponse` failed decoding instead"
              );
              return ResponseUnprocessableEntity;
            }
          ),
          E.map(ResponseSuccessJson),
          E.getOrElse(t.identity)
        ),
      flow => {
        switch (flow) {
          case FlowCase.FAIL_APPROVE_TERMS_STATUS_404:
            return ResponseErrorNotFound(
              `Mock – Failure case ${FlowCase[flow]}`,
              ""
            );
          case FlowCase.FAIL_APPROVE_TERMS_STATUS_422:
            return ResponseUnprocessableEntity;
          case FlowCase.FAIL_APPROVE_TERMS_STATUS_500:
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

export const approveTermsHandler = (
  sessionUser: ISessionUser
): EndpointHandler<ApproveTermsUsingPOSTT> => async (
  req
): Promise<HandlerResponseType<ApproveTermsUsingPOSTT>> => {
  const flowId = getFlowCookie(req);

  return pipe(
    req.body,
    ApproveTermsRequest.decode,
    E.mapLeft<t.Errors, HandlerResponseType<ApproveTermsUsingPOSTT>>(e => {
      logger.info(
        PathReporter.report(E.left<t.Errors, ApproveTermsRequest>(e))
      );
      logger.warn(
        "PM `approveTerms` endpoint doesn't have HTTP 400 responses, returning 422 on `ApproveTermsRequest` failed decoding instead"
      );
      return ResponseUnprocessableEntity;
    }),
    E.map(approveTermsRequest =>
      approveTermsController(
        sessionUser,
        flowId
      )({
        Bearer: "",
        approveTermsRequest
      })
    ),
    E.getOrElse(t.identity)
  );
};
