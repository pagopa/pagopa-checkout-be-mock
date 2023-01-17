import * as express from "express";
import { NewTransactionResponse } from "../generated/ecommerce/NewTransactionResponse";
import { TransactionStatusEnum } from "../generated/ecommerce/TransactionStatus";
import { PartyConfigurationFaultPaymentProblemJson } from "../generated/ecommerce/PartyConfigurationFaultPaymentProblemJson";
import { PartyConfigurationFaultEnum } from "../generated/ecommerce/PartyConfigurationFault";
import { FaultCategoryEnum } from "../generated/ecommerce/FaultCategory";

export const createSuccessActivationResponseEntity = (
  req: express.Request
): NewTransactionResponse => ({
  transactionId: "17ac8de3-2033-4c46-b534-f191966ce84c",
  payments: req.body.paymentNotices,
  status: TransactionStatusEnum.ACTIVATED,
  clientId: undefined,
  authToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJ0cmFuc2FjdGlvbklkIjoiMTdhYzhkZTMtMjAzMy00YzQ2LWI1MzQtZjE5MTk2NmNlODRjIiwicnB0SWQiOiI3Nzc3Nzc3Nzc3NzMzMDIwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoibmFtZS5zdXJuYW1lQHBhZ29wYS5pdCIsInBheW1lbnRUb2tlbiI6IjRkNTAwZTk5MDg3MTQyMDJiNTU3NTFlZDZiMWRmZGYzIiwianRpIjoiODUxNjQ2NDQzMjUxMTQxIn0.Fl3PoDBgtEhDSMFR3unkAow8JAe2ztYDoxlu7h-q_ygmmGvO7zP5dlztELUQCofcmYwhB4L9EgSLNT-HbiJgKA",
  amountTotal: 99999999
});

export const error502statusCode = (): PartyConfigurationFaultPaymentProblemJson => ({
  title: "EC error",
  faultCodeCategory: FaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: PartyConfigurationFaultEnum.PAA_SINTASSI_XSD
});
