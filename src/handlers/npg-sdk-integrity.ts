import { RequestHandler } from "express";
import { logger } from "../logger";

export const npgSdkIntegrity: RequestHandler = async (_req, res) => {
  logger.info("[Get NPG SDK integrity] - Return NPG SDK integrity hash");
  res.status(200).send({
    integrityHash:
      "sha384-dhR+dKVjiXoA8ZNODO+zKzgioWlnNMSKaLbNPT/GdTn0NgIoA4ke+4/bq6CfQjpJ"
  });
};
