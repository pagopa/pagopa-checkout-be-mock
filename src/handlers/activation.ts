/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import * as express from "express";
import { logger } from "../logger";
import {
  createSuccessActivationResponseEntity,
  error502statusCode
} from "../utils/ecommerce_activation";
import {
  EcommerceActivationFlowCase,
  getEcommerceActivationFlowCase
} from "../flow";

const returnSuccessResponse = (req: express.Request, res: any): void => {
  logger.info("[Activation ecommerce] - Return success case");
  res.status(200).send(createSuccessActivationResponseEntity(req));
};

const returnError502 = (res: any): void => {
  logger.info("[Activation ecommerce] - Return 502 error case");
  res.status(502).send(error502statusCode());
};

export const authRequestXpay: RequestHandler = async (req, res) => {
  switch (getEcommerceActivationFlowCase(req.params.requestId)) {
    case EcommerceActivationFlowCase.OK:
      returnSuccessResponse(req, res);
      break;
    case EcommerceActivationFlowCase.FAIL_VERIFY_502_PPT_SINTASSI_XSD:
      returnError502(res);
      break;
  }
};
