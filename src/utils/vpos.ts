import { CcPaymentInfoAcceptedResponse } from "../generated/pgs/CcPaymentInfoAcceptedResponse";
import {
  CcPaymentInfoAcsResponse,
  ResponseTypeEnum,
  StatusEnum
} from "../generated/pgs/CcPaymentInfoAcsResponse";
import { CcPaymentInfoAuthorizedResponse } from "../generated/pgs/CcPaymentInfoAuthorizedResponse";
import { CcPaymentInfoError } from "../generated/pgs/CcPaymentInfoError";

export const createVposAcsResponse = (
  status: StatusEnum,
  requestId: string,
  responseType: ResponseTypeEnum,
  vposUrl: string
): CcPaymentInfoAcsResponse => ({
  requestId,
  responseType,
  status,
  vposUrl
});

export const createVposAuthorizedResponse = (
  status: StatusEnum,
  requestId: string,
  redirectUrl: string,
  authCode: string
): CcPaymentInfoAuthorizedResponse => ({
  authCode,
  redirectUrl,
  requestId,
  status
});

export const createVposResponse = (
  status: StatusEnum,
  requestId: string,
  redirectUrl?: string
): CcPaymentInfoAcceptedResponse => ({
  redirectUrl,
  requestId,
  status
});

export const createPaymentRequestVposErrorResponse = (): CcPaymentInfoError => ({
  message: "RequestId non trovato"
});
