// eslint-disable-next-line sort-keys
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { HttpStatusCode } from "../../generated/ecommerce/HttpStatusCode";
import { PaymentMethodStatusEnum } from "../../generated/ecommerce/PaymentMethodStatus";
import { CalculateFeeResponse as CalculateFeeResponseV1 } from "../../generated/ecommerce/CalculateFeeResponse";
import { CalculateFeeResponse as CalculateFeeResponseV2 } from "../../generated/ecommerce-v2/CalculateFeeResponse";
import { cardBrandAssets } from "./payment-method";

export const enum Version {
  V1 = "V1",
  V2 = "V2"
}

const assetUrl = "https://assets.cdn.platform.pagopa.it/creditcard/generic.png";

const createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThresholdV1 = (): CalculateFeeResponseV1 => ({
  asset: assetUrl,
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
  paymentMethodDescription: "payment method description (v1)",
  paymentMethodName: "test",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

const createSuccessGetPspByPaymentMethodsIdResponseEntityUpThresholdV1 = (): CalculateFeeResponseV1 => ({
  asset: assetUrl,
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
  paymentMethodDescription: "payment method description (v1)",
  paymentMethodName: "test",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

const createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThresholdV2 = (): CalculateFeeResponseV2 => ({
  asset: assetUrl,
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
      idPsp: "PTG1",
      onUs: false,
      paymentMethod: "paymentMethod1",
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
      idPsp: "PTG2",
      onUs: true,
      paymentMethod: "paymentMethod2",
      pspBusinessName: "BUNDLE2 ONUS",
      taxPayerFee: 15,
      touchpoint: "FHXHF"
    }
  ],
  paymentMethodDescription: "payment method description (v2)",
  paymentMethodName: "test",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

const createSuccessGetPspByPaymentMethodsIdResponseEntityUpThresholdV2 = (): CalculateFeeResponseV2 => ({
  asset: assetUrl,
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
      idPsp: "PTG3",
      onUs: true,
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
      idPsp: "PTG4",
      onUs: false,
      paymentMethod: "paymentMethod4",
      pspBusinessName: "BUNDLE4",
      taxPayerFee: 25,
      touchpoint: "FHXHF"
    }
  ],
  paymentMethodDescription: "payment method description (v2)",
  paymentMethodName: "test",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

export const createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold = (
  version: Version
): CalculateFeeResponseV1 | CalculateFeeResponseV2 => {
  switch (version) {
    case Version.V1:
      return createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThresholdV1();
    case Version.V2:
      return createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThresholdV2();
    default:
      throw Error(`Unhandled calculate fees version: ${version}`);
  }
};

export const createSuccessGetPspByPaymentMethodsIdResponseEntityUpThreshold = (
  version: Version
): CalculateFeeResponseV1 | CalculateFeeResponseV2 => {
  switch (version) {
    case Version.V1:
      return createSuccessGetPspByPaymentMethodsIdResponseEntityUpThresholdV1();
    case Version.V2:
      return createSuccessGetPspByPaymentMethodsIdResponseEntityUpThresholdV2();
    default:
      throw Error(`Unhandled calculate fees version: ${version}`);
  }
};

export const error400BadRequest = (): ProblemJson => ({
  detail: "Bad Reqeust",
  status: 400 as HttpStatusCode,
  title: "Invalid body request"
});

export const error404NotFound = (): ProblemJson => ({
  // detail: `No bundle found for payment method with id: [${paymentMethodId}] and transaction amount: [${importo}] for touch point: [${clientId}]`,
  detail: `No bundle found`,
  status: 404 as HttpStatusCode,
  title: "Not found"
});
