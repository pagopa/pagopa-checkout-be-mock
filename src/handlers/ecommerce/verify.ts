/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as express from "express";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import { logger } from "../../logger";
import {
  createSuccessVerifyRptIdEntity,
  error404DominioSconosciuto,
  error404StazioneIntTimeout
} from "../../utils/ecommerce/verify";
import { FlowCase, getFlowFromRptId, setFlowCookie } from "../../flow";

const verifyErrorCase = [
  FlowCase.FAIL_VERIFY_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA,
  FlowCase.FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO
];

const returnSuccessResponse = (req: express.Request, res: any): void => {
  logger.info("[Verify ecommerce] - Return success case");
  res.status(200).send(createSuccessVerifyRptIdEntity(req.params.rptId));
};

const return404ErrorDominioSconosciuto = (res: any): void => {
  logger.info(
    "[Verify ecommerce] - Return 404 FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO"
  );
  res.status(404).send(error404DominioSconosciuto());
};

const return404ErrorStazioneIntTimeout = (res: any): void => {
  logger.info(
    "[Verify ecommerce] - Return 404 FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO"
  );
  res.status(404).send(error404StazioneIntTimeout());
};

export const ecommerceVerify: RequestHandler = async (req, res) => {
  const flowId = pipe(
    req.params.rptId,
    getFlowFromRptId,
    O.map(id => (!verifyErrorCase.includes(id) ? FlowCase.OK : id)),
    O.getOrElse(() => FlowCase.OK)
  );
  switch (flowId) {
    case FlowCase.FAIL_VERIFY_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA:
      return404ErrorStazioneIntTimeout(res);
      break;
    case FlowCase.FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO:
      return404ErrorDominioSconosciuto(res);
      break;
    default:
      setFlowCookie(res, flowId);
      returnSuccessResponse(req, res);
  }
};
