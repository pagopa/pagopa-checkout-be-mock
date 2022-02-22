import * as O from "fp-ts/lib/Option";
import * as express from "express";
import { pipe } from "fp-ts/function";

export enum FlowCase {
  OK,
  FAIL_VERIFY_424,
  FAIL_VERIFY_500,
  FAIL_ACTIVATE_424,
  FAIL_ACTIVATE_500,
  FAIL_PAYMENT_STATUS_404,
  FAIL_PAYMENT_STATUS_424,
  FAIL_PAYMENT_STATUS_500
}

type FlowCaseKey = keyof typeof FlowCase;

export const getFlowFromRptId: (
  rptId: string
) => O.Option<FlowCase> = rptId => {
  const prefix = rptId.slice(0, -2);
  const flowId = Number(rptId.slice(-2));

  if (prefix !== "777777777773020167237496700") {
    return O.none;
  }

  if (flowId in FlowCase) {
    return O.some(flowId as FlowCase);
  } else {
    return O.none;
  }
};

export const getFlowCookie: (req: express.Request) => FlowCase = req =>
  pipe(
    O.fromNullable(req.cookies.mockFlow),
    O.filter(id => id in FlowCase),
    O.map((id: FlowCaseKey) => FlowCase[id]),
    O.getOrElse(() => FlowCase.OK as FlowCase)
  );

export const setFlowCookie: (
  res: express.Response,
  flowId: FlowCase
) => void = (res, flowId) => {
  res.cookie("mockFlow", FlowCase[flowId]);
};
