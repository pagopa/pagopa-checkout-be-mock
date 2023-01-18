import { PSPsResponse } from "../../generated/ecommerce/PSPsResponse";
import { LanguageEnum, StatusEnum } from "../../generated/ecommerce/Psp";

export const createSuccessGetPspResponseEntity = (): PSPsResponse => ({
  psp: [
    {
      brokerName: "50000000001",
      businessName: "PSP TEST",
      channelCode: "50000000001_03",
      code: "50000000001",
      description: "OK - PSP TEST",
      fixedCost: 606,
      language: LanguageEnum.IT,
      maxAmount: 3000,
      minAmount: 2000,
      paymentTypeCode: "AD",
      status: StatusEnum.ENABLED
    },
    {
      brokerName: "50000000002",
      businessName: "PSP TEST 2",
      channelCode: "50000000002_03",
      code: "50000000002",
      description: "OK - PSP TEST 2",
      fixedCost: 606,
      language: LanguageEnum.IT,
      maxAmount: 2000,
      minAmount: 1000,
      paymentTypeCode: "AD",
      status: StatusEnum.DISABLED
    },
    {
      brokerName: "50000000003",
      businessName: "PSP TEST 3",
      channelCode: "50000000003_03",
      code: "50000000003",
      description: "OK - PSP TEST 3",
      fixedCost: 606,
      language: LanguageEnum.IT,
      maxAmount: 4000,
      minAmount: 2000,
      paymentTypeCode: "AD",
      status: StatusEnum.ENABLED
    }
  ]
});
