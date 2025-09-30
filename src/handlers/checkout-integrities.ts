import { RequestHandler } from "express";
import { parse } from "date-fns";
import { logger } from "../logger";
// import { CheckoutIntegritiesResponse } from "../generated/checkout-feature-flags/FeatureFlagsResponse";

interface ICheckoutIntegrityItem {
  readonly value: string;
  readonly timestamp: Date;
}

interface ICheckoutIntegritiesResponse {
  readonly current: ICheckoutIntegrityItem | null;
  readonly crossOriginDomain: string | null;
  readonly hashes: ReadonlyArray<ICheckoutIntegrityItem> | null;
}

const emptyIntegritiesResponse: ICheckoutIntegritiesResponse = {
  crossOriginDomain: null,
  current: null,
  hashes: null
};

const npgIntegritiesResponse: ICheckoutIntegritiesResponse = {
  crossOriginDomain: "anonymous",
  current: {
    timestamp: parse("2025-05-20T10:30:00Z"),
    value:
      "sha384-d0c476847c92619bec806b184318dfb61980aab36dfbe932a36a09a6e5801ba6601351f681fc8a2f6d61aa4ad3d56e8e"
  },
  hashes: [
    {
      timestamp: parse("2025-05-20T10:30:00Z"),
      value:
        "sha384-d0c476847c92619bec806b184318dfb61980aab36dfbe932a36a09a6e5801ba6601351f681fc8a2f6d61aa4ad3d56e8e"
    },
    {
      timestamp: parse("2024-02-01T01:01:00Z"),
      value:
        "sha384-36f4419bd8260cedcb1d4637ba4c2d106ba1fb01af8312bb3c2d48ee4828776954972651dbfad9367464fcb81b7abc05"
    },
    {
      timestamp: parse("2033-01-01T01:01:00Z"),
      value: "sha256-xHkWCgIAs0AUzQSHX86JHRhE2KfKNCLEB9OyBNOm2U0="
    },
    {
      timestamp: parse("2025-01-01T01:01:00Z"),
      value:
        "sha384-acIAUzMiyY7OdTf7XwUq47biYeay+R8oahL7R2QEmHOxz8sJxnj1m/qqQ261Q2WX"
    }
  ]
};

const buildResponseForResource = (
  resourceId: string
): ICheckoutIntegritiesResponse =>
  resourceId === "npg" ? npgIntegritiesResponse : emptyIntegritiesResponse;

export const checkoutIntegrities: RequestHandler = async (req, res) => {
  logger.info(
    `[Get Checkout Integrities] - Return integrities for ${req.params.resourceId}`
  );
  const resourceId = req.params.resourceId;
  const integrities: ICheckoutIntegritiesResponse = buildResponseForResource(
    resourceId
  );
  res.status(200).send(integrities);
};
