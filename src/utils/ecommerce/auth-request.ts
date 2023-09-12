import { RequestAuthorizationResponse } from "../../generated/ecommerce/RequestAuthorizationResponse";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { HttpStatusCode } from "../../generated/ecommerce/HttpStatusCode";

export const createSuccessAuthRequestResponseEntity = (): RequestAuthorizationResponse => ({
  authorizationRequestId: "requestId",
  authorizationUrl: "https://example.com"
});

export const createSuccessAuthRequestResponseEntityFromNPG = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonResponse: any
): RequestAuthorizationResponse => ({
  authorizationRequestId: "requestId",
  authorizationUrl: jsonResponse.url
});

export const error404TransactionIdNotFound = (
  transactionId: string
): ProblemJson => ({
  detail: "Transaction with id: " + transactionId + " not found",
  instance: "Example instance",
  status: 404 as HttpStatusCode,
  title: "Transaction not found"
});

export const error409TransactionAlreadyProcessed = (
  transactionId: string
): ProblemJson => ({
  detail:
    "Transaction with transaction id: " +
    transactionId +
    " has been already processed",
  instance: "Example instance",
  status: 409 as HttpStatusCode,
  title: "Transaction already processed"
});

export const error400InvalidRequestBody = (): ProblemJson => ({
  detail: "Invalid request body",
  instance: "Instance",
  status: 400 as HttpStatusCode,
  title: "The request body is invalid"
});
