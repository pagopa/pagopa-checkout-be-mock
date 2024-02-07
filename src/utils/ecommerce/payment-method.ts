import { NonNegativeInteger } from "@pagopa/ts-commons/lib/numbers";
import { PaymentMethodsResponse } from "../../generated/ecommerce/PaymentMethodsResponse";
import { PaymentMethodStatusEnum } from "../../generated/ecommerce/PaymentMethodStatus";
import { PaymentMethodManagementTypeEnum } from "../../generated/ecommerce/PaymentMethodManagementType";
export const createSuccessGetPaymentMethods = (): PaymentMethodsResponse => ({
  paymentMethods: [
    {
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
      description: "PostePay",
      id: "1c23629f-8133-42f3-ad96-7e6527d27a43",
      methodManagement: PaymentMethodManagementTypeEnum.ONBOARDABLE,
      name: "PostePay",
      paymentTypeCode: "PPAY",
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
