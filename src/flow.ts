import * as O from "fp-ts/lib/Option";

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
