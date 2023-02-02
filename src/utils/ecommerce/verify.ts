import { AmountEuroCents } from "../../generated/ecommerce/AmountEuroCents";
import { FaultCategoryEnum } from "../../generated/ecommerce/FaultCategory";
import { PaymentRequestsGetResponse } from "../../generated/ecommerce/PaymentRequestsGetResponse";
import { ValidationFaultPaymentProblemJson } from "../../generated/ecommerce/ValidationFaultPaymentProblemJson";
import { ValidationFaultEnum } from "../../generated/pagopa_proxy/ValidationFault";

export const createSuccessVerifyRptIdEntity = (
  rptId: string
): PaymentRequestsGetResponse => ({
  amount: 12000 as AmountEuroCents,
  description: "Pagamento di Test",
  dueDate: "2021-07-31",
  paFiscalCode: rptId.substring(0, 11),
  paName: "Pagamento di Test",
  paymentContextCode: "a5560817eabc44ba877aaf4db96a606f",
  rptId
});

export const error404DominioSconosciuto = (): ValidationFaultPaymentProblemJson => ({
  faultCodeCategory: FaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: ValidationFaultEnum.PPT_DOMINIO_SCONOSCIUTO,
  title: "EC error"
});

export const error404StazioneIntTimeout = (): ValidationFaultPaymentProblemJson => ({
  faultCodeCategory: FaultCategoryEnum.PAYMENT_UNAVAILABLE,
  faultCodeDetail: ValidationFaultEnum.PPT_STAZIONE_INT_PA_SCONOSCIUTA,
  title: "Validation Fault"
});
