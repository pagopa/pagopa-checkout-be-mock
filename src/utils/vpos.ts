import {
  PaymentRequestVposResponse,
  ResponseTypeEnum,
  StatusEnum
} from "../generated/pgs/PaymentRequestVposResponse";
import { PaymentRequestVposErrorResponse } from "../generated/pgs/PaymentRequestVposErrorResponse";

export const createPaymentRequestVposResponse = (
  status: StatusEnum,
  requestId: string,
  responseType?: ResponseTypeEnum,
  vposUrl?: string,
  clientReturnUrl?: string
): PaymentRequestVposResponse => ({
  clientReturnUrl,
  requestId,
  responseType,
  status,
  vposUrl
});

export const createPaymentRequestVposErrorResponse = (): PaymentRequestVposErrorResponse => ({
  reason: "RequestId non trovato"
});
