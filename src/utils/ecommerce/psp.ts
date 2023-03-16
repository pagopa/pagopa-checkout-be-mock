// eslint-disable-next-line sort-keys
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { HttpStatusCode } from "../../generated/ecommerce/HttpStatusCode";
import { PaymentMethodStatusEnum } from "../../generated/ecommerce/PaymentMethodStatus";
import { CalculateFeeResponse } from "../../generated/ecommerce/CalculateFeeResponse";

export const createSuccessGetPspByPaymentMethodsIdResponseEntityBelowThreshold = (): unknown => ({
  belowThreshold: false,
  bundles: [
    {
      abi: null,
      bundleDescription: "description",
      bundleName: "global-3",
      idBrokerPsp: null,
      idBundle: "35ab5e95-8a1c-4f69-ab94-dbf82c8d50cc",
      idChannel: null,
      idCiBundle: null,
      idPsp: "1234567891",
      onUs: false,
      paymentMethod: "CP",
      primaryCiIncurredFee: 0,
      taxPayerFee: 200,
      touchpoint: "CHECKOUT"
    },
    {
      abi: null,
      bundleDescription: "awesome bundle",
      bundleName: "test1",
      idBrokerPsp: null,
      idBundle: "18228156-ccb4-4a24-b9e1-fc6d43e69762",
      idChannel: null,
      idCiBundle: null,
      idPsp: "IDPSPFNZ",
      onUs: false,
      paymentMethod: "CP",
      primaryCiIncurredFee: 0,
      taxPayerFee: 200,
      touchpoint: "CHECKOUT"
    }
  ],
  paymentMethodName: "Carte",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

export const createSuccessGetPspByPaymentMethodsIdResponseEntityUpThreshold = (): CalculateFeeResponse => ({
  belowThreshold: false,
  bundles: [
    {
      abi: "3333",
      bundleDescription: "bundle 3 OnUs",
      bundleName: "BUNDLE3 OnUs",
      idBrokerPsp: "123445",
      idBundle: "789",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTG3",
      onUs: true,
      primaryCiIncurredFee: 0,
      taxPayerFee: 20,
      touchpoint: "FHGHF"
    },
    {
      abi: "4444",
      bundleDescription: "bundle 4",
      bundleName: "BUNDLE4",
      idBrokerPsp: "3243",
      idBundle: "012",
      idChannel: "aasd",
      idCiBundle: "dede",
      idPsp: "PTG4",
      onUs: false,
      paymentMethod: "paymentMethod4",
      primaryCiIncurredFee: 0,
      taxPayerFee: 25,
      touchpoint: "FHXHF"
    }
  ],
  paymentMethodName: "test",
  paymentMethodStatus: PaymentMethodStatusEnum.ENABLED
});

export const error400BadRequest = (): ProblemJson => ({
  detail: "Bad Reqeust",
  status: 400 as HttpStatusCode,
  title: "Invalid body request"
});
