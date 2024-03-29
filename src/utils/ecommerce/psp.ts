// eslint-disable-next-line sort-keys
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { HttpStatusCode } from "../../generated/ecommerce/HttpStatusCode";
import { PaymentMethodStatusEnum } from "../../generated/ecommerce/PaymentMethodStatus";
import { CalculateFeeResponse } from "../../generated/ecommerce/CalculateFeeResponse";
import { cardBrandAssets } from "./payment-method";

export const createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold = (): CalculateFeeResponse => ({
  asset: "https://assets.cdn.platform.pagopa.it/creditcard/generic.png",
  belowThreshold: true,
  brandAssets: cardBrandAssets,
  bundles: [
    {
      abi: "AMREX",
      bundleDescription: "bundle 1",
      bundleName: "BUNDLE1 - OLD",
      idBrokerPsp: "12344",
      idBundle: "123",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTG1",
      onUs: false,
      paymentMethod: "paymentMethod1",
      primaryCiIncurredFee: 0,
      pspBusinessName: "BUNDLE1",
      taxPayerFee: 10,
      touchpoint: "FHGHF"
    },
    {
      abi: "AMREX",
      bundleDescription: "bundle 2",
      bundleName: "BUNDLE2 ONUS - OLD",
      idBrokerPsp: "3243",
      idBundle: "456",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTG2",
      onUs: true,
      paymentMethod: "paymentMethod2",
      primaryCiIncurredFee: 0,
      pspBusinessName: "BUNDLE2 ONUS",
      taxPayerFee: 15,
      touchpoint: "FHXHF"
    }
  ],
  paymentMethodDescription: "payment method description",
  paymentMethodName: "test",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

export const createSuccessGetPspByPaymentMethodsIdResponseEntityUpThreshold = (): CalculateFeeResponse => ({
  asset: "https://assets.cdn.platform.pagopa.it/creditcard/generic.png",
  belowThreshold: false,
  brandAssets: cardBrandAssets,
  bundles: [
    {
      abi: "AMREX",
      bundleDescription: "bundle 3 OnUs",
      bundleName: "BUNDLE3 OnUs - OLD",
      idBrokerPsp: "123445",
      idBundle: "789",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTG3",
      onUs: true,
      primaryCiIncurredFee: 0,
      pspBusinessName: "BUNDLE3 ONUS",
      taxPayerFee: 20,
      touchpoint: "FHGHF"
    },
    {
      abi: "AMREX",
      bundleDescription: "bundle 4",
      bundleName: "BUNDLE4 - OLD",
      idBrokerPsp: "3243",
      idBundle: "012",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTG4",
      onUs: false,
      paymentMethod: "paymentMethod4",
      primaryCiIncurredFee: 0,
      pspBusinessName: "BUNDLE4",
      taxPayerFee: 25,
      touchpoint: "FHXHF"
    }
  ],
  paymentMethodDescription: "payment method description",
  paymentMethodName: "test",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

export const error400BadRequest = (): ProblemJson => ({
  detail: "Bad Reqeust",
  status: 400 as HttpStatusCode,
  title: "Invalid body request"
});
