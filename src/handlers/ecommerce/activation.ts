/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as express from "express";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import { logger } from "../../logger";
import {
  createSuccessActivationResponseEntity,
  error502SintassiXSD,
  error504StazioneIntTimeout,
  error409PagamentoInCorso,
  error404DominioSconosciuto
} from "../../utils/ecommerce/ecommerce_activation";
import { FlowCase, getFlowFromRptId } from "../../flow";

const returnSuccessResponse = (req: express.Request, res: any): void => {
  logger.info("[Activation ecommerce] - Return success case");
  res.status(200).send(createSuccessActivationResponseEntity(req));
};

const return502ErrorSintassiXSD = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 502 FAIL_VERIFY_502_PPT_SINTASSI_XSD"
  );
  res.status(502).send(error502SintassiXSD());
};

const return504ErrorStazioneIntPaTimeout = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 504 FAIL_VERIFY_504_PPT_STAZIONE_INT_PA_TIMEOUT"
  );
  res.status(504).send(error504StazioneIntTimeout());
};

const return409ErrorPagamentoInCorso = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 409 PPT_PAGAMENTO_IN_CORSO");
  res.status(409).send(error409PagamentoInCorso());
};

const return404ErrorDominioSconosciuto = (res: any): void => {
  logger.info(
    "[Activation ecommerce] - Return 404 FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO"
  );
  res.status(404).send(error404DominioSconosciuto());
};

export const ecommerceActivation: RequestHandler = async (req, res) => {
  const flowId = pipe(
    req.body.paymentNotices[0].rptId,
    getFlowFromRptId,
    O.getOrElse(() => FlowCase.OK)
  );
  switch (flowId) {
    case FlowCase.FAIL_ACTIVATE_502_PPT_SINTASSI_XSD:
      return502ErrorSintassiXSD(res);
      break;
    case FlowCase.FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT:
      return504ErrorStazioneIntPaTimeout(res);
      break;
    case FlowCase.FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO:
      return409ErrorPagamentoInCorso(res);
      break;
    case FlowCase.FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO:
      return404ErrorDominioSconosciuto(res);
      break;
    default:
      returnSuccessResponse(req, res);
  }
};
