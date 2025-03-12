/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { LoginResponse } from "../generated/checkout-auth-service-v1/LoginResponse";
import { logger } from "../logger";
import { AuthResponse } from "../generated/checkout-auth-service-v1/AuthResponse";
import { AuthRequest } from "../generated/checkout-auth-service-v1/AuthRequest";
import { ProblemJson } from "../generated/checkout-auth-service-v1/ProblemJson";
import { FlowCase, getFlowCookie } from "../flow";
import { UserInfoResponse } from "../generated/checkout-auth-service-v1/UserInfoResponse";

const generateRandomString = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

export const checkoutAuthServiceLogin: RequestHandler = async (_req, res) => {
  logger.info("[Get Auth Login] - Return success");

  const code = generateRandomString(16);
  const state = generateRandomString(16);

  const loginResponse: LoginResponse = {
    urlRedirect: `http://localhost:1234/auth-callback?code=${code}&state=${state}`
  };
  res.status(200).send(loginResponse);
};

export const checkoutAuthServicePostToken = (req: any, res: any): void => {
  const body: AuthRequest = req.body;
  if (!body.authCode || !body.state) {
    logger.info("[Post Auth Token] - Error Missing authCode or state");
    const response: ProblemJson = {
      title: "AuthCode or state is missing"
    };
    res.status(500).send(response);
    return;
  }

  const authToken = generateRandomString(32);
  logger.info("[Post Auth Token] - Return success");
  const loginResponse: AuthResponse = {
    authToken
  };
  res.status(200).send(loginResponse);
};

const checkoutAuthServicePostToken500 = (res: any): void => {
  const response: ProblemJson = {
    title: "AuthCode or state is missing"
  };
  res.status(500).send(response);
};

export const checkoutAuthServicePostTokenHandler: RequestHandler = async (
  req,
  res
) => {
  logger.info("[User auth post token]");
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (getFlowCookie(req)) {
    case FlowCase.FAIL_POST_AUTH_TOKEN:
      logger.info("[User auth post token] - Return error case 500");
      checkoutAuthServicePostToken500(res);
      break;
    default:
      logger.info("[User auth post token] - Return success case 200 OK");
      checkoutAuthServicePostToken(req, res);
  }
};

const checkoutAuthServiceGetUsers500 = (res: any): void => {
  const response: ProblemJson = {
    title: "Error retrieving user data"
  };
  res.status(500).send(response);
};

const checkoutAuthServiceGetUsers401 = (res: any): void => {
  res.status(401).send({
    title: "Unauthorized error"
  } as ProblemJson);
};

const checkoutAuthServiceGetUsers = (res: any): void => {
  const userInfo: UserInfoResponse = {
    familyName: "RossiTest",
    name: "MarioTest",
    userId: "ZSSZLI85M01Z501Z"
  };
  return res.status(200).send(userInfo);
};

const checkoutAuthServiceLogout = (res: any): void => res.status(204).send();
const checkoutAuthServiceLogout4xx = (res: any): void => res.status(400).send();
const checkoutAuthServiceLogout5xx = (res: any): void => res.status(500).send();

export const checkoutAuthServiceLogoutUsersHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  logger.info("[Logout Users]");

  switch (getFlowCookie(req)) {
    case FlowCase.FAIL_LOGOUT_400:
      logger.info("[Get Users] - Return error case 500");
      checkoutAuthServiceLogout4xx(res);
      break;
    case FlowCase.FAIL_LOGOUT_500:
      logger.info("[Get Users] - Return error case 400");
      checkoutAuthServiceLogout5xx(res);
      break;
    default:
      logger.info("[Logout Users] - Return success case 204 OK");
      checkoutAuthServiceLogout(res);
  }
};

export const checkoutAuthServiceGetUsersHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  logger.info("[Get Users]");
  switch (getFlowCookie(req)) {
    case FlowCase.FAIL_GET_USERS_500:
      logger.info("[Get Users] - Return error case 500");
      checkoutAuthServiceGetUsers500(res);
      break;
    case FlowCase.FAIL_GET_USERS_401:
      logger.info("[Get Users] - Return error case 401");
      checkoutAuthServiceGetUsers401(res);
      break;
    default:
      logger.info("[Get Users] - Return success case 200 OK");
      checkoutAuthServiceGetUsers(res);
  }
};
