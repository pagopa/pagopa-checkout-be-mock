import { RequestHandler } from "express";
import { logger } from "../logger";
import { FeatureFlagsResponse } from "../generated/checkout-feature-flags/FeatureFlagsResponse";

export const readFeatureFlagFromCookie = (
  cookies: Record<string, string>,
  cookieName: string,
  defaultValue: boolean
): boolean => {
  const cookie = cookies[cookieName];
  return cookie ? cookie === "true" : defaultValue;
};

export const checkoutFeatureFlag: RequestHandler = async (req, res) => {
  logger.info("[Get Feature flag] - Return checkout feature flags");
  const loginResponse: FeatureFlagsResponse = {
    isAuthenticationEnabled: readFeatureFlagFromCookie(
      req.cookies,
      "authenticationEnabledFF",
      true
    ),
    isMaintenancePageEnabled: readFeatureFlagFromCookie(
      req.cookies,
      "maintenancePageEnabledFF",
      false
    ),
    isPaymentMethodsHandlerEnabled: readFeatureFlagFromCookie(
      req.cookies,
      "paymentMethodsHandlerEnabledFF",
      true
    ),
    isPaymentWalletEnabled: readFeatureFlagFromCookie(
      req.cookies,
      "walletEnabledFF",
      false
    ),
    isPspPickerPageEnabled: readFeatureFlagFromCookie(
      req.cookies,
      "pspPickerPageEnabledFF",
      true
    ),
    isScheduledMaintenanceBannerEnabled: readFeatureFlagFromCookie(
      req.cookies,
      "scheduledMaintenanceBannerEnabledFF",
      false
    )
  };
  res.status(200).send(loginResponse);
};
