import { PSPsResponse } from "../../generated/ecommerce/PSPsResponse";
import { LanguageEnum, StatusEnum } from "../../generated/ecommerce/Psp";
import { BundleOption } from "../../generated/ecommerce/BundleOption";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { HttpStatusCode } from "../../generated/ecommerce/HttpStatusCode";

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

export const createSuccessGetPspByPaymentMethodsIdResponseEntity = (): BundleOption => ({
  belowThreshold: true,
  bundleOptions: [
    {
      abi: "1111",
      bundleDescription: "bundle 1",
      bundleName: "BUNDLE1",
      idBrokerPsp: "12344",
      idBundle: "123",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTTTG",
      onUs: true,
      paymentMethod: "dehduheuhduedehud",
      primaryCiIncurredFee: 0,
      taxPayerFee: 0,
      touchpoint: "FHGHF"
    },
    {
      abi: "2222",
      bundleDescription: "bundle 2",
      bundleName: "BUNDLE2",
      idBrokerPsp: "3243",
      idBundle: "123",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTTTG",
      onUs: false,
      paymentMethod: "frfrfrfrfrfrfrfrrf",
      primaryCiIncurredFee: 0,
      taxPayerFee: 0,
      touchpoint: "FHXHF"
    }
  ]
});

export const error400BadRequest = (): ProblemJson => ({
  detail: "Bad Reqeust",
  status: 400 as HttpStatusCode,
  title: "Invalid body request"
});
