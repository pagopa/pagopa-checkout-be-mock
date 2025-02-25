import { RequestHandler } from "express";
import { LoginResponse } from "../generated/checkout-auth-service-v1/LoginResponse";
import { logger } from "../logger";
import { AuthResponse } from "../generated/checkout-auth-service-v1/AuthResponse";

export const checkoutAuthServiceLogin: RequestHandler = async (_req, res) => {
  logger.info("[Get Auth Login] - Return success");
  const loginResponse: LoginResponse = {
    urlRedirect:
      "http://localhost:1234/auth-callback?auth-code=J0NYD7UqPejqXpl6Fdv8"
  };
  res.status(200).send(loginResponse);
};

export const checkoutAuthServicePostToken: RequestHandler = async (
  req,
  res
) => {
  if (!req.body.authCode) {
    logger.info("[Post Auth Token] - Error Missing authCode");
    res.status(500).send();
    return;
  }

  logger.info("[Post Auth Token] - Return success");
  const loginResponse: AuthResponse = {
    authToken: "B2T4HeCx7wTvBRABSZ36"
  };
  res.status(200).send(loginResponse);
};
