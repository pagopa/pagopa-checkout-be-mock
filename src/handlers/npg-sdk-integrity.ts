import { RequestHandler } from "express";
import { logger } from "../logger";

export const npgSdkIntegrity: RequestHandler = async (_req, res) => {
  logger.info("[Get NPG SDK SRI] - Return NPG SDK integrity hash");
  res.status(200).send({
    integrityHash:
      "sha384-d0c476847c92619bec806b184318dfb61980aab36dfbe932a36a09a6e5801ba6601351f681fc8a2f6d61aa4ad3d56e8e"
  });
};
