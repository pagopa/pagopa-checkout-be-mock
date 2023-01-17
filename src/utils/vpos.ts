import { CcPaymentInfoAcceptedResponse } from "../generated/pgs/CcPaymentInfoAcceptedResponse";
import { CcPaymentInfoAcsResponse } from "../generated/pgs/CcPaymentInfoAcsResponse";
import { CcPaymentInfoError } from "../generated/pgs/CcPaymentInfoError";

export const createVposCcPaymentInfoAcceptedResponse = (
  status: string,
  requestId: string
): CcPaymentInfoAcceptedResponse => ({
  requestId,
  responseType: "",
  status
});

export const createVposCcPaymentInfoAcsResponse = (
  status: string,
  requestId: string,
  responseType: string,
  vposUrl: string
): CcPaymentInfoAcsResponse => ({
  requestId,
  responseType,
  status,
  vposUrl
});

export const createVposCcPaymentInfoError = (): CcPaymentInfoError => ({
  reason: "RequestId non trovato"
});
