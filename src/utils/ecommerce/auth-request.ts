import { RequestAuthorizationResponse } from "../../generated/ecommerce/RequestAuthorizationResponse";
import { ProblemJson } from "../../generated/ecommerce/ProblemJson";
import { HttpStatusCode } from "../../generated/ecommerce/HttpStatusCode";

const encode = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

export const createSuccessAuthRequestResponseEntity = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any
): RequestAuthorizationResponse => ({
  authorizationRequestId: "requestId",
  authorizationUrl: `${req.protocol}://${req.get("Host")}/esito`
});

export const createSuccessAuthRequestResponseEntityFromNPG = (_value: {
  readonly origin: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly jsonResponse: any;
}): RequestAuthorizationResponse => ({
  authorizationRequestId: "requestId",
  authorizationUrl:
    _value.origin +
    "/gdi-check#gdiIframeUrl=" +
    encode(_value.jsonResponse.fieldSet.fields[0].src)
});

export const error5XX = (): ProblemJson => ({
  detail: "Bad gateway auth request error",
  instance: "Bad gateway example instance",
  status: 500 as HttpStatusCode,
  title: "Bad Gateway"
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
