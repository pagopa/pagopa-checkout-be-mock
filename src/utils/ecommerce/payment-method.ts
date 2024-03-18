import { NonNegativeInteger } from "@pagopa/ts-commons/lib/numbers";
import { PaymentMethodsResponse } from "../../generated/ecommerce/PaymentMethodsResponse";
import { PaymentMethodStatusEnum } from "../../generated/ecommerce/PaymentMethodStatus";
import { PaymentMethodManagementTypeEnum } from "../../generated/ecommerce/PaymentMethodManagementType";

export const cardBrandAssets = {
  AMEX: "https://assets.cdn.platform.pagopa.it/creditcard/amex.png",
  DINERS: "https://assets.cdn.platform.pagopa.it/creditcard/diners.png",
  MAESTRO: "https://assets.cdn.platform.pagopa.it/creditcard/maestro.png",
  MASTERCARD: "https://assets.cdn.platform.pagopa.it/creditcard/mastercard.png",
  MC: "https://assets.cdn.platform.pagopa.it/creditcard/mastercard.png",
  VISA: "https://assets.cdn.platform.pagopa.it/creditcard/visa.png"
};

export const createSuccessGetPaymentMethods = (): PaymentMethodsResponse => ({
  paymentMethods: [
    {
      asset: "https://assets.cdn.platform.pagopa.it/creditcard/generic.png",
      brandAssets: cardBrandAssets,
      description: "Carte",
      id: "3ebea7a1-2e77-4a1b-ac1b-3aca0d67f813",
      methodManagement: PaymentMethodManagementTypeEnum.ONBOARDABLE,
      name: "Carte",
      paymentTypeCode: "CP",
      ranges: [
        {
          max: 999999 as NonNegativeInteger,
          min: 0 as NonNegativeInteger
        }
      ],
      status: PaymentMethodStatusEnum.ENABLED
    },
    {
      asset: "https://assets.cdn.io.italia.it/logos/apps/paga-con-postepay.png",
      description: "Paga con Postepay",
      id: "1c12349f-8133-42f3-ad96-7e6527d27a41",
      methodManagement: PaymentMethodManagementTypeEnum.REDIRECT,
      name: "Paga con Poste Pay",
      paymentTypeCode: "RBPP",
      ranges: [
        {
          max: 999999 as NonNegativeInteger,
          min: 0 as NonNegativeInteger
        }
      ],
      status: PaymentMethodStatusEnum.ENABLED
    },
    {
      description: "Conto BancoPosta",
      id: "1123429f-8133-42f3-ad96-7e6527d27a43",
      methodManagement: PaymentMethodManagementTypeEnum.REDIRECT,
      name: "Conto BancoPosta",
      paymentTypeCode: "RBPR",
      ranges: [
        {
          max: 999999 as NonNegativeInteger,
          min: 0 as NonNegativeInteger
        }
      ],
      status: PaymentMethodStatusEnum.ENABLED
    },
    {
      description: "BancoPosta Impresa",
      id: "1c12349f-8133-42f3-ad96-7e6527d27a40",
      methodManagement: PaymentMethodManagementTypeEnum.REDIRECT,
      name: "BancoPosta Impresa",
      paymentTypeCode: "RBPB",
      ranges: [
        {
          max: 999999 as NonNegativeInteger,
          min: 0 as NonNegativeInteger
        }
      ],
      status: PaymentMethodStatusEnum.ENABLED
    },
    {
      description: "Conto Intesa Sanpaolo",
      id: "1c21234f-8133-42f3-ad96-7e6527d27a45",
      methodManagement: PaymentMethodManagementTypeEnum.REDIRECT,
      name: "Conto Intesa Sanpaolo",
      paymentTypeCode: "RPIC",
      ranges: [
        {
          max: 999999 as NonNegativeInteger,
          min: 0 as NonNegativeInteger
        }
      ],
      status: PaymentMethodStatusEnum.ENABLED
    },
    {
      asset: "https://assets.cdn.io.italia.it/logos/apps/satispay.png",
      description: "Satispay",
      id: "0021234f-12345-42f3-ad96-7e6527d27a44",
      methodManagement: PaymentMethodManagementTypeEnum.REDIRECT,
      name: "Satispay",
      paymentTypeCode: "SATY",
      ranges: [
        {
          max: 999999 as NonNegativeInteger,
          min: 0 as NonNegativeInteger
        }
      ],
      status: PaymentMethodStatusEnum.ENABLED
    }
  ]
});
