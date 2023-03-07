import { BundleOption } from "../../generated/ecommerce/BundleOption";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { HttpStatusCode } from "../../generated/ecommerce/HttpStatusCode";

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
      idPsp: "PTG1",
      onUs: true,
      paymentMethod: "paymentMethod1",
      primaryCiIncurredFee: 0,
      taxPayerFee: 10,
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
      idPsp: "PTG2",
      onUs: false,
      paymentMethod: "paymentMethod2",
      primaryCiIncurredFee: 0,
      taxPayerFee: 15,
      touchpoint: "FHXHF"
    }
  ]
});

export const error400BadRequest = (): ProblemJson => ({
  detail: "Bad Reqeust",
  status: 400 as HttpStatusCode,
  title: "Invalid body request"
});
