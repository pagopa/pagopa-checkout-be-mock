import { RequestHandler } from "express";
import { LoginResponse } from "../generated/checkout-auth-service-v1/LoginResponse";
import { logger } from "../logger";
import { AuthResponse } from "../generated/checkout-auth-service-v1/AuthResponse";
import { AuthRequest } from "../generated/checkout-auth-service-v1/AuthRequest";
import { ProblemJson } from "../generated/checkout-auth-service-v1/ProblemJson";

export const checkoutAuthServiceLogin: RequestHandler = async (_req, res) => {
  logger.info("[Get Auth Login] - Return success");
  const loginResponse: LoginResponse = {
    urlRedirect:
      "http://localhost:1234/auth-callback?code=J0NYD7UqPejqXpl6Fdv8&state=1BWuOGF4L3CTroTEvUVF"
  };
  res.status(200).send(loginResponse);
};

export const checkoutAuthServicePostToken: RequestHandler = async (
  req,
  res
) => {
  const body: AuthRequest = req.body;
  if (!body.authCode || !body.state) {
    logger.info("[Post Auth Token] - Error Missing authCode or state");
    const response: ProblemJson = {
      title: "AuthCode or state is missing"
    };
    res.status(500).send(response);
    return;
  }

  logger.info("[Post Auth Token] - Return success");
  const loginResponse: AuthResponse = {
    authToken: "B2T4HeCx7wTvBRABSZ36"
  };
  res.status(200).send(loginResponse);
};

export const checkoutAuthServicePostToken500: RequestHandler = async (
  req,
  res
) => {
  const response: ProblemJson = {
    title: "AuthCode or state is missing"
  };
  res.status(500).send(response);
};
