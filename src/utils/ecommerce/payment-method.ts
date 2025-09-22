import { NonNegativeInteger } from "@pagopa/ts-commons/lib/numbers";
import { PaymentMethodsResponse } from "../../generated/ecommerce/PaymentMethodsResponse";
import { PaymentMethodStatusEnum } from "../../generated/ecommerce/PaymentMethodStatus";
import { PaymentMethodManagementTypeEnum } from "../../generated/ecommerce/PaymentMethodManagementType";
import { PaymentMethodsResponse as PaymentMethodsResponseV2 } from "../../generated/ecommerce-v2/PaymentMethodsResponse";
import {
  PaymentTypeCodeEnum,
  MethodManagementEnum,
  StatusEnum
} from "../../generated/ecommerce-v2/PaymentMethodResponse";
import { getEnumFromString } from "../utils";

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
          max: 1000 as NonNegativeInteger,
          min: 1000 as NonNegativeInteger
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
    },
    {
      asset: "https://assets.cdn.platform.pagopa.it/apm/mybank.png",
      description: "MyBank",
      id: "2c61e6ed-f874-4b30-97ef-bdf89d488ee4",
      methodManagement: PaymentMethodManagementTypeEnum.NOT_ONBOARDABLE,
      name: "MYBANK",
      paymentTypeCode: "MYBK",
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

export const convertV1GetPaymentMethodsToV2 = (): PaymentMethodsResponseV2 => {
  const paymentMethodResponse = createSuccessGetPaymentMethods();
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    paymentMethods: paymentMethodResponse.paymentMethods!.map(p => ({
      description: {
        DE: `${p.description}_DE_description`,
        EN: `${p.description}_EN_description`,
        FR: `${p.description}_FR_description`,
        IT: p.description,
        SL: `${p.description}_SL_description`
      },
      feeRange: {
        max: p.ranges[0].max as number,
        min: p.ranges[0].min as number
      },
      group: getEnumFromString(PaymentTypeCodeEnum, p.paymentTypeCode),
      id: p.id,
      methodManagement: getEnumFromString(
        MethodManagementEnum,
        p.methodManagement
      ),
      name: {
        DE: `${p.description}_DE_name`,
        EN: `${p.description}_EN_name`,
        FR: `${p.description}_FR_name`,
        IT: p.description,
        SL: `${p.description}_SL_name`
      },
      paymentMethodAsset: p.asset ?? "http://asset",
      paymentMethodTypes: [p.paymentTypeCode === "CP" ? "CARTE" : "CONTO"],
      paymentMethodsBrandAssets: p.brandAssets,
      paymentTypeCode: getEnumFromString(
        PaymentTypeCodeEnum,
        p.paymentTypeCode
      ),
      status: StatusEnum.ENABLED,
      validityDateFrom: new Date("2000-01-01")
    }))
  };
};
