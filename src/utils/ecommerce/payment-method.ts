import { PaymentMethodsResponse } from "../../generated/ecommerce/PaymentMethodsResponse";
import { StatusEnum } from "../../generated/ecommerce/Psp";
export const createSuccessGetPaymentMethods = (): PaymentMethodsResponse => [
  {
    description: "Carte",
    id: "3ebea7a1-2e77-4a1b-ac1b-3aca0d67f813",
    name: "Carte",
    paymentTypeCode: "CP",
    ranges: [
      {
        max: undefined,
        min: undefined
      }
    ],
    status: StatusEnum.ENABLED
  },
  {
    description: "PostePay",
    id: "1c23629f-8133-42f3-ad96-7e6527d27a43",
    name: "PostePay",
    paymentTypeCode: "PPAY",
    ranges: [
      {
        max: undefined,
        min: undefined
      }
    ],
    status: StatusEnum.ENABLED
  }
];
