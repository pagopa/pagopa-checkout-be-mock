import * as O from "fp-ts/lib/Option";
import * as express from "express";
import { pipe } from "fp-ts/function";

export enum FlowCase {
  OK,
  FAIL_ACTIVATE_500,
  FAIL_ACTIVATE_424
}

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
    O.map(id => Number(id)),
    O.filter(id => id in FlowCase),
    O.getOrElse(() => FlowCase.OK)
  );

export const setFlowCookie: (
  res: express.Response,
  flowId: FlowCase
) => void = (res, flowId) => {
  res.cookie("mockFlow", flowId);
};
