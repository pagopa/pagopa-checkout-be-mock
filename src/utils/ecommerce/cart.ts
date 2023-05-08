import { EmailString } from "@pagopa/ts-commons/lib/strings";
import { CartRequest } from "../../generated/ecommerce/CartRequest";

export const createSuccessGetCartResponseEntity = (): CartRequest => ({
  emailNotice: "myemail@mail.it" as EmailString,
  idCart: "ecCartIdExample",
  paymentNotices: [
    {
      amount: 1000,
      companyName: "test1",
      description: "test1",
      fiscalCode: "77777777777",
      noticeNumber: "302012387654312300"
    },
    {
      amount: 2000,
      companyName: "test2",
      description: "test2",
      fiscalCode: "77777777777",
      noticeNumber: "302012387654312301"
    },
    {
      amount: 3000,
      companyName: "test3",
      description: "test3",
      fiscalCode: "77777777777",
      noticeNumber: "302012387654312302"
    },
    {
      amount: 4000,
      companyName: "test4",
      description: "test4",
      fiscalCode: "77777777777",
      noticeNumber: "302012387654312303"
    },
    {
      amount: 5000,
      companyName: "test5",
      description: "test5",
      fiscalCode: "77777777777",
      noticeNumber: "302012387654312304"
    }
  ],
  returnUrls: {
    returnCancelUrl: "https://www.comune.di.prova.it/pagopa/cancel.html",
    returnErrorUrl: "https://www.comune.di.prova.it/pagopa/error.html",
    returnOkUrl: "https://www.comune.di.prova.it/pagopa/success.html"
  }
});
