import * as express from "express";
import {
  ClientIdEnum,
  NewTransactionResponse
} from "../../generated/ecommerce/NewTransactionResponse";
import { TransactionStatusEnum } from "../../generated/ecommerce/TransactionStatus";
import { PartyConfigurationFaultPaymentProblemJson } from "../../generated/ecommerce/PartyConfigurationFaultPaymentProblemJson";
import { PartyConfigurationFaultEnum } from "../../generated/ecommerce/PartyConfigurationFault";
import { FaultCategoryEnum } from "../../generated/ecommerce/FaultCategory";
import { PartyTimeoutFaultPaymentProblemJson } from "../../generated/ecommerce/PartyTimeoutFaultPaymentProblemJson";
import { PartyTimeoutFaultEnum } from "../../generated/ecommerce/PartyTimeoutFault";
import { PaymentStatusFaultPaymentProblemJson } from "../../generated/ecommerce/PaymentStatusFaultPaymentProblemJson";
import { PaymentStatusFaultEnum } from "../../generated/ecommerce/PaymentStatusFault";
import { ValidationFaultPaymentProblemJson } from "../../generated/ecommerce/ValidationFaultPaymentProblemJson";
import { ValidationFaultEnum } from "../../generated/ecommerce/ValidationFault";

export const createSuccessActivationResponseEntity = (
  req: express.Request,
  transactionId: string
): NewTransactionResponse => ({
  authToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJ0cmFuc2FjdGlvbklkIjoiMTdhYzhkZTMtMjAzMy00YzQ2LWI1MzQtZjE5MTk2NmNlODRjIiwicnB0SWQiOiI3Nzc3Nzc3Nzc3NzMzMDIwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoibmFtZS5zdXJuYW1lQHBhZ29wYS5pdCIsInBheW1lbnRUb2tlbiI6IjRkNTAwZTk5MDg3MTQyMDJiNTU3NTFlZDZiMWRmZGYzIiwianRpIjoiODUxNjQ2NDQzMjUxMTQxIn0.Fl3PoDBgtEhDSMFR3unkAow8JAe2ztYDoxlu7h-q_ygmmGvO7zP5dlztELUQCofcmYwhB4L9EgSLNT-HbiJgKA",
  clientId: ClientIdEnum.CHECKOUT,
  payments: req.body.paymentNotices,
  status: TransactionStatusEnum.ACTIVATED,
  transactionId
});

export const error502SintassiXSD = (): PartyConfigurationFaultPaymentProblemJson => ({
  faultCodeCategory: FaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: PartyConfigurationFaultEnum.PAA_SINTASSI_XSD,
  title: "EC error"
});

export const error504StazioneIntTimeout = (): PartyTimeoutFaultPaymentProblemJson => ({
  faultCodeCategory: FaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: PartyTimeoutFaultEnum.PPT_STAZIONE_INT_PA_TIMEOUT,
  title: "EC error"
});

export const error409PagamentoInCorso = (): PaymentStatusFaultPaymentProblemJson => ({
  faultCodeCategory: FaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: PaymentStatusFaultEnum.PPT_PAGAMENTO_IN_CORSO,
  title: "EC error"
});

export const error404DominioSconosciuto = (): ValidationFaultPaymentProblemJson => ({
  faultCodeCategory: FaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: ValidationFaultEnum.PPT_DOMINIO_SCONOSCIUTO,
  title: "EC error"
});
