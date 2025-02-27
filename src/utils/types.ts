import {
  IResponseType,
  TypeofApiParams,
  TypeofApiResponse
} from "@pagopa/ts-commons/lib/requests";
import {
  HttpStatusCodeEnum,
  IResponse,
  IResponseErrorForbiddenAnonymousUser,
  IResponseErrorInternal,
  IResponseErrorNotFound,
  IResponseErrorValidation,
  IResponseSuccessJson,
  ResponseErrorGeneric
} from "@pagopa/ts-commons/lib/responses";
import * as express from "express";
import { WithinRangeInteger } from "@pagopa/ts-commons/lib/numbers";
import { PaymentFaultEnum } from "../generated/pagopa_proxy/PaymentFault";
import { PartyConfigurationFaultEnum } from "../generated/pagopa_proxy/PartyConfigurationFault";
import { PartyConfigurationFaultPaymentProblemJson } from "../generated/pagopa_proxy/PartyConfigurationFaultPaymentProblemJson";
import { GatewayFaultEnum } from "../generated/pagopa_proxy/GatewayFault";
import {
  PartyTimeoutFault,
  PartyTimeoutFaultEnum
} from "../generated/pagopa_proxy/PartyTimeoutFault";
import { PartyTimeoutFaultPaymentProblemJson } from "../generated/pagopa_proxy/PartyTimeoutFaultPaymentProblemJson";
import { ValidationFaultEnum } from "../generated/pagopa_proxy/ValidationFault";
import { PaymentStatusFault } from "../generated/pagopa_proxy/PaymentStatusFault";
import { PaymentStatusFaultPaymentProblemJson } from "../generated/pagopa_proxy/PaymentStatusFaultPaymentProblemJson";

type InnerHandlerResponseType<T> = T extends IResponseType<200, infer R>
  ? IResponseSuccessJson<R> // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<201, infer _A>
  ? IResponseSuccessfulCreated // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<400, infer _B>
  ? IResponseErrorValidation // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<401, infer _C>
  ? IResponseUnauthorized // eslint-disable-next-line @typescript-eslint/no-unused-vars,
  : T extends IResponseType<403, infer _D>
  ? IResponseErrorForbiddenAnonymousUser // eslint-disable-next-line @typescript-eslint/no-unused-vars,
  : T extends IResponseType<404, infer _E>
  ? IResponseErrorValidationFault | IResponseErrorNotFound // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<409, infer _E>
  ? IResponsePaymentStatusFaultError // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<422, infer _F>
  ? IResponseUnprocessableEntity // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<500, infer _G>
  ? IResponseErrorInternal // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<502, infer _H>
  ? IResponseGatewayError // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<503, infer _I>
  ? IResponsePartyConfigurationError // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<504, infer _J>
  ? IResponseGatewayTimeout // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : never;

export type HandlerResponseType<T> = InnerHandlerResponseType<
  TypeofApiResponse<T>
>;

export type EndpointHandler<T> = (
  req: express.Request
) => Promise<HandlerResponseType<T>>;

export type EndpointController<T> = (
  params: TypeofApiParams<T>
) => HandlerResponseType<T>;

export type IResponsePaymentInternalError = IResponse<"IResponseErrorInternal">;

type HttpCode = number & WithinRangeInteger<100, 599>;

export declare type IResponseSuccessfulCreated = IResponse<
  "IResponseSuccessfulCreated"
>;

/**
 * Returns a 201 response without a body.
 */
export const ResponseSuccessfulCreated: IResponseSuccessfulCreated = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  apply: res => res.status(HttpStatusCodeEnum.HTTP_STATUS_201).send(),
  kind: "IResponseSuccessfulCreated"
};

export declare type IResponseUnauthorized = IResponse<"IResponseUnauthorized">;

/**
 * Returns a 401 response without a body.
 */
export const ResponseUnauthorized: IResponseUnauthorized = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  apply: res => res.status(HttpStatusCodeEnum.HTTP_STATUS_401).send(),
  kind: "IResponseUnauthorized"
};

export declare type IResponseUnprocessableEntity = IResponse<
  "IResponseUnprocessableEntity"
>;

export type IResponsePaymentStatusFaultError = IResponse<
  "IResponsePaymentStatusFaultError"
>;

/**
 * Returns a 409 with json response.
 */
export const ResponsePaymentStatusFaultError = (
  detail: PaymentFaultEnum,
  detailV2: PaymentStatusFault
): IResponsePaymentStatusFaultError => {
  const problem: PaymentStatusFaultPaymentProblemJson = {
    detail,
    detail_v2: detailV2,
    status: HttpStatusCodeEnum.HTTP_STATUS_409 as HttpCode,
    title: "Conflicting payment status"
  };
  return {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    apply: res =>
      res
        .status(HttpStatusCodeEnum.HTTP_STATUS_409)
        // eslint-disable-next-line sonarjs/no-duplicate-string
        .set("Content-Type", "application/problem+json")
        .json(problem),
    kind: "IResponsePaymentStatusFaultError"
  };
};

/**
 * Returns a 422 response without a body.
 */
export const ResponseUnprocessableEntity: IResponseUnprocessableEntity = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  apply: res => res.status(HttpStatusCodeEnum.HTTP_STATUS_422).send(),
  kind: "IResponseUnprocessableEntity"
};

export type IResponsePartyConfigurationError = IResponse<
  "IResponsePartyConfigurationError"
>;

/**
 * Returns a 503 with json response.
 */
export const ResponsePartyConfigurationError = (
  detail: PaymentFaultEnum,
  detailV2: PartyConfigurationFaultEnum
): IResponsePartyConfigurationError => {
  const problem: PartyConfigurationFaultPaymentProblemJson = {
    detail,
    detail_v2: detailV2,
    status: HttpStatusCodeEnum.HTTP_STATUS_503 as HttpCode,
    title: "EC service error"
  };
  return {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    apply: res =>
      res
        .status(HttpStatusCodeEnum.HTTP_STATUS_503)
        // eslint-disable-next-line sonarjs/no-duplicate-string
        .set("Content-Type", "application/problem+json")
        .json(problem),
    kind: "IResponsePartyConfigurationError"
  };
};

export type IResponseErrorValidationFault = IResponse<
  "IResponseValidationError"
>;

export type IResponseGatewayError = IResponse<"IResponseGatewayError">;

/**
 * Returns a 502 with json response.
 */
export const ResponsePaymentError = (
  detail: PaymentFaultEnum | string,
  detailV2: GatewayFaultEnum
): IResponseGatewayError => {
  const problem = {
    detail,
    detail_v2: detailV2,
    status: HttpStatusCodeEnum.HTTP_STATUS_502 as HttpCode,
    title: "pagoPA service error"
  };
  return {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    apply: res =>
      res
        .status(HttpStatusCodeEnum.HTTP_STATUS_502)
        // eslint-disable-next-line sonarjs/no-duplicate-string
        .set("Content-Type", "application/problem+json")
        .json(problem),
    kind: "IResponseGatewayError"
  };
};

export type IResponseGatewayTimeout = IResponse<"IResponseErrorGatewayTimeout">;

/**
 * Returns a 504 response
 */
export const ResponseGatewayTimeout: (
  detail?: PartyTimeoutFault
) => IResponseGatewayTimeout = detail => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  apply: res => {
    const problem: PartyTimeoutFaultPaymentProblemJson = {
      detail: PaymentFaultEnum.GENERIC_ERROR,
      detail_v2: detail ?? PartyTimeoutFaultEnum.GENERIC_ERROR,
      status: HttpStatusCodeEnum.HTTP_STATUS_504 as HttpCode,
      title: "pagoPA service error"
    };

    res
      .status(HttpStatusCodeEnum.HTTP_STATUS_504)
      .set("Content-Type", "application/problem+json")
      .json(problem);
  },
  kind: "IResponseErrorGatewayTimeout"
});

export type IResponseProxyConnectionError = IResponse<
  "IResponseProxyConnectionError"
>;

export const ResponseErrorValidationFault: (
  title: string,
  detail: ValidationFaultEnum
) => IResponseErrorValidationFault = (title, detail) => {
  // eslint-disable-next-line functional/no-let
  let responseDetail;
  if (typeof detail === "string") {
    responseDetail = `${title}: ${detail}`;
  } else {
    responseDetail = detail;
  }
  return {
    ...ResponseErrorGeneric(HttpStatusCodeEnum.HTTP_STATUS_404, title, detail),
    detail: responseDetail,
    kind: "IResponseValidationError"
  };
};
