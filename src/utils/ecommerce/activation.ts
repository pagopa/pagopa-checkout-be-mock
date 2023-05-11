import * as express from "express";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import {
  ClientIdEnum,
  NewTransactionResponse
} from "../../generated/ecommerce/NewTransactionResponse";
import { TransactionStatusEnum } from "../../generated/ecommerce/TransactionStatus";
import { PartyConfigurationFaultPaymentProblemJson } from "../../generated/ecommerce/PartyConfigurationFaultPaymentProblemJson";
import { PartyConfigurationFaultEnum } from "../../generated/ecommerce/PartyConfigurationFault";
import { FaultCategoryEnum } from "../../generated/ecommerce/FaultCategory";
import { PaymentInfo } from "../../generated/ecommerce/PaymentInfo";
import { PartyTimeoutFaultPaymentProblemJson } from "../../generated/ecommerce/PartyTimeoutFaultPaymentProblemJson";
import { PartyTimeoutFaultEnum } from "../../generated/ecommerce/PartyTimeoutFault";
import { PaymentStatusFaultPaymentProblemJson } from "../../generated/ecommerce/PaymentStatusFaultPaymentProblemJson";
import { PaymentStatusFaultEnum } from "../../generated/ecommerce/PaymentStatusFault";
import { ValidationFaultPaymentProblemJson } from "../../generated/ecommerce/ValidationFaultPaymentProblemJson";
import { ValidationFaultEnum } from "../../generated/ecommerce/ValidationFault";
import { AmountEuroCents } from "../../generated/ecommerce/AmountEuroCents";
import { GatewayFaultPaymentProblemJson } from "../../generated/ecommerce/GatewayFaultPaymentProblemJson";
import { GatewayFaultEnum } from "../../generated/ecommerce/GatewayFault";

export const fillRequestPaymentInfoWithMockData = (
  paymentsInfo?: ReadonlyArray<PaymentInfo>
): ReadonlyArray<PaymentInfo> =>
  pipe(
    O.fromNullable(paymentsInfo),
    O.map(paymentNotices =>
      paymentNotices.map(paymentNotice => ({
        amount: paymentNotice.amount,
        paymentToken: "paymentToken1",
        reason: "reason1",
        rptId: paymentNotice.rptId,
        transferList: [
          {
            digitalStamp: true,
            paFiscalCode: "66666666666",
            transferAmount: 100 as AmountEuroCents,
            transferCategory: "transferCategory1"
          },
          {
            digitalStamp: false,
            paFiscalCode: "77777777777",
            transferAmount: 900 as AmountEuroCents,
            transferCategory: "transferCategory2"
          }
        ]
      }))
    ),
    O.getOrElse(() => [] as ReadonlyArray<PaymentInfo>)
  );

export const createSuccessActivationResponseEntity = (
  req: express.Request,
  transactionId: string
): NewTransactionResponse => ({
  authToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJ0cmFuc2FjdGlvbklkIjoiMTdhYzhkZTMtMjAzMy00YzQ2LWI1MzQtZjE5MTk2NmNlODRjIiwicnB0SWQiOiI3Nzc3Nzc3Nzc3NzMzMDIwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoibmFtZS5zdXJuYW1lQHBhZ29wYS5pdCIsInBheW1lbnRUb2tlbiI6IjRkNTAwZTk5MDg3MTQyMDJiNTU3NTFlZDZiMWRmZGYzIiwianRpIjoiODUxNjQ2NDQzMjUxMTQxIn0.Fl3PoDBgtEhDSMFR3unkAow8JAe2ztYDoxlu7h-q_ygmmGvO7zP5dlztELUQCofcmYwhB4L9EgSLNT-HbiJgKA",
  clientId: ClientIdEnum.CHECKOUT,
  payments: fillRequestPaymentInfoWithMockData(
    req.body.paymentNotices as ReadonlyArray<PaymentInfo>
  ),
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

export const error404ResourceNotFound = (): GatewayFaultPaymentProblemJson => ({
  faultCodeCategory: FaultCategoryEnum.GENERIC_ERROR,
  faultCodeDetail: GatewayFaultEnum.GENERIC_ERROR,
  title: "Resource Not Found"
});
