import * as express from "express";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import {
  ClientIdEnum,
  NewTransactionResponse
} from "../../generated/ecommerce/NewTransactionResponse";
import { TransactionStatusEnum } from "../../generated/ecommerce/TransactionStatus";
import { PaymentInfo } from "../../generated/ecommerce/PaymentInfo";
import { AmountEuroCents } from "../../generated/ecommerce/AmountEuroCents";
import { PaymentOngoingStatusFaultEnum } from "../../generated/ecommerce/PaymentOngoingStatusFault";
import {
  PaymentOngoingStatusFaultPaymentProblemJson,
  FaultCodeCategoryEnum as PaymentOngoingFaultCodeCategoryEnum
} from "../../generated/ecommerce/PaymentOngoingStatusFaultPaymentProblemJson";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { ValidationFaultPaymentDataErrorEnum } from "../../generated/ecommerce/ValidationFaultPaymentDataError";
import {
  FaultCodeCategoryEnum as PaymentDataErrorFaultCategoryEnum,
  ValidationFaultPaymentDataErrorProblemJson
} from "../../generated/ecommerce/ValidationFaultPaymentDataErrorProblemJson";
import { ValidationFaultPaymentUnavailableEnum } from "../../generated/ecommerce/ValidationFaultPaymentUnavailable";
import {
  FaultCodeCategoryEnum as PaymentUnavailableFaultCategoryEnum,
  ValidationFaultPaymentUnavailableProblemJson
} from "../../generated/ecommerce/ValidationFaultPaymentUnavailableProblemJson";
import { PartyConfigurationFaultEnum } from "../../generated/ecommerce/PartyConfigurationFault";
import {
  PartyConfigurationFaultPaymentProblemJson,
  FaultCodeCategoryEnum as PartyConfigurationFaultCategoryEnum
} from "../../generated/ecommerce/PartyConfigurationFaultPaymentProblemJson";
import {
  ValidationFaultPaymentUnknownProblemJson,
  FaultCodeCategoryEnum as ValidationFaultPaymentUnknownFaultCategoryEnum
} from "../../generated/ecommerce/ValidationFaultPaymentUnknownProblemJson";
import { ValidationFaultPaymentUnknownEnum } from "../../generated/ecommerce/ValidationFaultPaymentUnknown";
import {
  GatewayFaultPaymentProblemJson,
  FaultCodeCategoryEnum as GatewayFaultCategoryEnum
} from "../../generated/ecommerce/GatewayFaultPaymentProblemJson";

export const fillRequestPaymentInfoWithMockData = (
  paymentsInfo?: ReadonlyArray<PaymentInfo>
): ReadonlyArray<PaymentInfo> =>
  pipe(
    O.fromNullable(paymentsInfo),
    O.map(paymentNotices =>
      paymentNotices.map((paymentNotice, index) => ({
        amount: paymentNotice.amount,
        isAllCCP: false,
        paymentToken: `paymentToken${index}`,
        reason: `reason${index}`,
        rptId: paymentNotice.rptId,
        transferList: [
          {
            digitalStamp: true,
            paFiscalCode: index.toString().repeat(11),
            transferAmount: 100 as AmountEuroCents,
            transferCategory: `transferCategory${index}`
          },
          {
            digitalStamp: false,
            paFiscalCode: (index + 1).toString().repeat(11),
            transferAmount: 900 as AmountEuroCents,
            transferCategory: `transferCategory${index + 1}`
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

export const error400InvalidInput = (): ProblemJson => ({
  title: "Invalid input"
});

export const error404StazioneIntPaSconosciuta = (): ValidationFaultPaymentDataErrorProblemJson => ({
  faultCodeCategory: PaymentDataErrorFaultCategoryEnum.PAYMENT_DATA_ERROR,
  faultCodeDetail:
    ValidationFaultPaymentDataErrorEnum.PPT_STAZIONE_INT_PA_SCONOSCIUTA,
  title: "Validation Fault"
});

export const error404PagamentoSconosciuto = (): ValidationFaultPaymentUnknownProblemJson => ({
  faultCodeCategory:
    ValidationFaultPaymentUnknownFaultCategoryEnum.PAYMENT_UNKNOWN,
  faultCodeDetail: ValidationFaultPaymentUnknownEnum.PAA_PAGAMENTO_SCONOSCIUTO,
  title: "Payment Unknown Fault"
});

export const error409PagamentoInCorso = (): PaymentOngoingStatusFaultPaymentProblemJson => ({
  faultCodeCategory: PaymentOngoingFaultCodeCategoryEnum.PAYMENT_ONGOING,
  faultCodeDetail: PaymentOngoingStatusFaultEnum.PAA_PAGAMENTO_IN_CORSO,
  title: "Validation Fault"
});

export const error502PspSconosciuto = (): ValidationFaultPaymentUnavailableProblemJson => ({
  faultCodeCategory: PaymentUnavailableFaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: ValidationFaultPaymentUnavailableEnum.PPT_PSP_SCONOSCIUTO,
  title: "Payment Unavailable Fault"
});

export const error503StazioneIntPATimeout = (): PartyConfigurationFaultPaymentProblemJson => ({
  faultCodeCategory: PartyConfigurationFaultCategoryEnum.DOMAIN_UNKNOWN,
  faultCodeDetail: PartyConfigurationFaultEnum.PPT_STAZIONE_INT_PA_TIMEOUT,
  title: "Party configuration Fault"
});

export const error502GenericError = (): GatewayFaultPaymentProblemJson => ({
  faultCodeCategory: GatewayFaultCategoryEnum.GENERIC_ERROR,
  faultCodeDetail: "NODE_ERROR_NOT_HANDLED",
  title: "Generic Error Fault"
});
