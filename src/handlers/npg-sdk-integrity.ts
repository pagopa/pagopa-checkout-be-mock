import { RequestHandler } from "express";
import { logger } from "../logger";

// Static mock integrity hash for the NPG SDK.
const MOCK_INTEGRITY_HASH =
  "sha384-dhR+dKVjiXoA8ZNODO+zKzgioWlnNMSKaLbNPT/GdTn0NgIoA4ke+4/bq6CfQjpJ";

export const npgSdkIntegrity: RequestHandler = (_req, res) => {
  logger.info("[Get NPG SDK integrity] - Return NPG SDK integrity hash");
  res.status(200).send({ integrityHash: MOCK_INTEGRITY_HASH });
};
