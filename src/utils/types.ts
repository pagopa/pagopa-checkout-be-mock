import {
  IResponseType,
  TypeofApiParams,
  TypeofApiResponse
} from "@pagopa/ts-commons/lib/requests";
import {
  HttpStatusCodeEnum,
  IResponse,
  IResponseErrorForbiddenNotAuthorized,
  IResponseErrorInternal,
  IResponseErrorNotFound,
  IResponseErrorValidation,
  IResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import * as express from "express";
import { WithinRangeInteger } from "@pagopa/ts-commons/lib/numbers";
import { PaymentFaultEnum } from "../generated/pagopa_proxy/PaymentFault";
import { PaymentFaultV2Enum } from "../generated/pagopa_proxy/PaymentFaultV2";
import { PaymentProblemJson } from "../generated/pagopa_proxy/PaymentProblemJson";

type InnerHandlerResponseType<T> = T extends IResponseType<200, infer R>
  ? IResponseSuccessJson<R>
  : T extends IResponseType<201, infer A>
  ? IResponseSuccessJson<A> // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<400, infer _B>
  ? IResponseErrorValidation // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<401, infer _C>
  ? IResponseErrorForbiddenNotAuthorized // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<404, infer _D>
  ? IResponseErrorNotFound // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<422, infer _E>
  ? IResponseErrorValidation // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<424, infer _F>
  ? IResponsePaymentInternalError // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : T extends IResponseType<500, infer _D>
  ? IResponseErrorInternal
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

/**
 * Returns a 424 with json response.
 */
export const ResponsePaymentError = (
  detail: PaymentFaultEnum,
  detailV2: PaymentFaultV2Enum
): IResponsePaymentInternalError => {
  const problem: PaymentProblemJson = {
    detail,
    detail_v2: detailV2,
    status: HttpStatusCodeEnum.HTTP_STATUS_424 as HttpCode,
    title: "pagoPA service error"
  };
  return {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    apply: res =>
      res
        .status(HttpStatusCodeEnum.HTTP_STATUS_424)
        .set("Content-Type", "application/problem+json")
        .json(problem),
    kind: "IResponseErrorInternal"
  };
};
