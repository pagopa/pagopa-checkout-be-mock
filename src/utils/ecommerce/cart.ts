import { EmailString } from "@pagopa/ts-commons/lib/strings";
import { CartRequest } from "../../generated/ecommerce/CartRequest";

export const createSuccessGetCartResponseEntity = (): CartRequest => ({
  emailNotice: "myemail@mail.it" as EmailString,
  paymentNotices: [
    {
      amount: 1000,
      companyName: "test",
      description: "test",
      fiscalCode: "77777777777",
      noticeNumber: "302012387654312384"
    }
  ],
  returnUrls: {
    returnCancelUrl: "www.comune.di.prova.it/pagopa/cancel.html",
    returnErrorUrl: "www.comune.di.prova.it/pagopa/error.html",
    returnOkUrl: "www.comune.di.prova.it/pagopa/success.html"
  }
});
