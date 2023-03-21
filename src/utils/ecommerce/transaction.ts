import { HttpStatusCode, ProblemJson } from "@pagopa/ts-commons/lib/responses";
import { AmountEuroCents } from "../../generated/ecommerce/AmountEuroCents";
import { ClientIdEnum } from "../../generated/ecommerce/NewTransactionResponse";
import { RptId } from "../../generated/ecommerce/RptId";
import { TransactionInfo } from "../../generated/ecommerce/TransactionInfo";
import { TransactionStatusEnum } from "../../generated/ecommerce/TransactionStatus";

export const createSuccessGetTransactionEntity = (
  transactionId: string
): TransactionInfo => ({
  authToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJ0cmFuc2FjdGlvbklkIjoiMTdhYzhkZTMtMjAzMy00YzQ2LWI1MzQtZjE5MTk2NmNlODRjIiwicnB0SWQiOiI3Nzc3Nzc3Nzc3NzMzMDIwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoibmFtZS5zdXJuYW1lQHBhZ29wYS5pdCIsInBheW1lbnRUb2tlbiI6IjRkNTAwZTk5MDg3MTQyMDJiNTU3NTFlZDZiMWRmZGYzIiwianRpIjoiODUxNjQ2NDQzMjUxMTQxIn0.Fl3PoDBgtEhDSMFR3unkAow8JAe2ztYDoxlu7h-q_ygmmGvO7zP5dlztELUQCofcmYwhB4L9EgSLNT-HbiJgKA",
  clientId: ClientIdEnum.CHECKOUT,
  feeTotal: 99999999,
  payments: [
    {
      amount: 1000 as AmountEuroCents,
      paymentToken: "paymentToken1",
      reason: "reason1",
      rptId: "77777777777302012387654312384" as RptId
    }
  ],
  status: TransactionStatusEnum.NOTIFIED_OK,
  transactionId
});

export const error404TransactionIdNotFound = (
  transactionId: string
): ProblemJson => ({
  detail: "Transaction with id: " + transactionId + " not found",
  instance: "Example instance",
  status: 404 as HttpStatusCode,
  title: "Transaction not found"
});

export const internalServerError500 = (): ProblemJson => ({
  detail: "Internal server error",
  instance: "Example instance",
  status: 500 as HttpStatusCode,
  title: "Internal server error"
});
