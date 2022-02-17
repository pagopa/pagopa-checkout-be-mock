import {
  IResponseType,
  TypeofApiParams,
  TypeofApiResponse
} from "@pagopa/ts-commons/lib/requests";
import {
  IResponseErrorForbiddenAnonymousUser,
  IResponseErrorForbiddenNotAuthorized,
  IResponseErrorInternal,
  IResponseErrorNotFound,
  IResponseErrorValidation,
  IResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import * as express from "express";

type InnerHandlerResponseType<T> = T extends IResponseType<200, infer R>
  ? IResponseSuccessJson<R>
  : T extends IResponseType<201, undefined>
  ? IResponseSuccessJson<undefined>
  : T extends IResponseType<400, undefined>
  ? IResponseErrorValidation
  : T extends IResponseType<401, undefined>
  ? IResponseErrorForbiddenNotAuthorized
  : T extends IResponseType<403, undefined>
  ? IResponseErrorForbiddenAnonymousUser
  : T extends IResponseType<404, undefined>
  ? IResponseErrorNotFound
  : T extends IResponseType<422, undefined>
  ? IResponseErrorValidation
  : T extends IResponseType<500, undefined>
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
