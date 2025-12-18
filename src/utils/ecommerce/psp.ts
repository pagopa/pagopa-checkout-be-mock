/* eslint-disable sonarjs/no-duplicate-string */
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
      abi: "33111",
      bundleDescription: "Pagamenti con carte",
      bundleName: "Worldline Merchant Services Italia S.p.A.",
      idBrokerPsp: "05963231005",
      idBundle: "98d24e9a-ab8b-48e3-ae84-f0c16c64db3b",
      idChannel: "05963231005_01",
      idPsp: "BNLIITRR",
      onUs: true,
      paymentMethod: "CP",
      pspBusinessName: "Worldline Merchant Services Italia S.p.A.",
      taxPayerFee: 15,
      touchpoint: "CHECKOUT"
    },
    {
      abi: "WOLLNLB1",
      bundleDescription: "Pacchetto test 500",
      bundleName: "WP 100-500",
      idBrokerPsp: "NL853935051B01",
      idBundle: "189073b8-7b25-4296-a38d-774f286f3823",
      idChannel: "NL853935051B01_02",
      idPsp: "WOLLNLB1",
      onUs: false,
      paymentMethod: "CP",
      pspBusinessName: "Worldpay BV",
      taxPayerFee: 0,
      touchpoint: "CHECKOUT"
    },
    {
      abi: "03069",
      bundleDescription:
        "Clienti e non delle Banche del Gruppo Intesa Sanpaolo possono disporre pagamenti con carte di pagamento VISA-MASTERCARD",
      bundleName: "Intesa Sanpaolo S.p.A.",
      idBrokerPsp: "00799960158",
      idBundle: "fbde6612-aa57-4985-9557-8a1c9284add4",
      idChannel: "00799960158_07",
      idPsp: "BCITITMM",
      onUs: false,
      paymentMethod: "CP",
      pspBusinessName: "Intesa Sanpaolo S.p.A.",
      taxPayerFee: 100,
      touchpoint: "CHECKOUT"
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
      abi: "33111",
      bundleDescription: "Pagamenti con carte",
      bundleName: "Worldline Merchant Services Italia S.p.A.",
      idBrokerPsp: "05963231005",
      idBundle: "98d24e9a-ab8b-48e3-ae84-f0c16c64db3b",
      idChannel: "05963231005_01",
      idPsp: "BNLIITRR",
      onUs: true,
      paymentMethod: "CP",
      pspBusinessName: "Worldline Merchant Services Italia S.p.A.",
      taxPayerFee: 15,
      touchpoint: "CHECKOUT"
    },
    {
      abi: "WOLLNLB1",
      bundleDescription: "Pacchetto test 500",
      bundleName: "WP 100-500",
      idBrokerPsp: "NL853935051B01",
      idBundle: "189073b8-7b25-4296-a38d-774f286f3823",
      idChannel: "NL853935051B01_02",
      idPsp: "WOLLNLB1",
      onUs: false,
      paymentMethod: "CP",
      pspBusinessName: "Worldpay BV",
      taxPayerFee: 0,
      touchpoint: "CHECKOUT"
    },
    {
      abi: "03069",
      bundleDescription:
        "Clienti e non delle Banche del Gruppo Intesa Sanpaolo possono disporre pagamenti con carte di pagamento VISA-MASTERCARD",
      bundleName: "Intesa Sanpaolo S.p.A.",
      idBrokerPsp: "00799960158",
      idBundle: "fbde6612-aa57-4985-9557-8a1c9284add4",
      idChannel: "00799960158_07",
      idPsp: "BCITITMM",
      onUs: false,
      paymentMethod: "CP",
      pspBusinessName: "Intesa Sanpaolo S.p.A.",
      taxPayerFee: 100,
      touchpoint: "CHECKOUT"
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

export const createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThresholdIdPsp = (
  version: Version,
  idPsp: string
): CalculateFeeResponseV1 | CalculateFeeResponseV2 => {
  switch (version) {
    case Version.V1: {
      const response = createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThresholdV1();
      return {
        ...response,
        bundles: response.bundles.filter(b => b.idPsp === idPsp)
      };
    }
    case Version.V2: {
      const response = createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThresholdV2();
      return {
        ...response,
        bundles: response.bundles.filter(b => b.idPsp === idPsp)
      };
    }
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
  detail: `No bundle found`,
  status: 404 as HttpStatusCode,
  title: "Not found"
});
