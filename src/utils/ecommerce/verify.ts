import { AmountEuroCents } from "../../generated/ecommerce/AmountEuroCents";
import { PaymentOngoingStatusFaultEnum } from "../../generated/ecommerce/PaymentOngoingStatusFault";
import {
  PaymentOngoingStatusFaultPaymentProblemJson,
  FaultCodeCategoryEnum as PaymentOngoingFaultCodeCategoryEnum
} from "../../generated/ecommerce/PaymentOngoingStatusFaultPaymentProblemJson";
import { PaymentRequestsGetResponse } from "../../generated/ecommerce/PaymentRequestsGetResponse";
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

export const createSuccessVerifyRptIdEntity = (
  rptId: string
): PaymentRequestsGetResponse => ({
  amount: 12000 as AmountEuroCents,
  description: "Pagamento di Test",
  dueDate: "2021-07-31",
  paFiscalCode: rptId.substring(0, 11),
  paName: "Pagamento di Test",
  rptId
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
