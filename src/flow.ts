import * as O from "fp-ts/lib/Option";
import { logger } from "./logger";

export enum FlowCase {
  OK,
  FAIL_ACTIVATE_500
}

export const getFlowFromRptId: (
  rptId: string
) => O.Option<FlowCase> = rptId => {
  const prefix = rptId.slice(0, -2);
  const flowId = Number(rptId.slice(-2));

  if (prefix !== "777777777773020167237496700") {
    return O.none;
  }

  logger.info(prefix);
  logger.info(flowId);

  if (flowId in FlowCase) {
    return O.some(flowId as FlowCase);
  } else {
    return O.none;
  }
};
