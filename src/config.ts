import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/lib/Either";
import { formatValidationErrors } from "io-ts-reporters";

const ConfigR = t.type({
  NPG_API_KEY: t.string,
  PSP_API_KEY: t.string
});

const ConfigO = t.partial({
  CHECK_STATUS_ADDITIONAL_ATTEMPTS: t.number,
  ENDPOINT_DELAY: t.number
});

const Config = t.intersection([ConfigR, ConfigO]);

export type Config = t.TypeOf<typeof Config>;

const getNumber = (
  env: Record<string, string | undefined>,
  key: string
): number | undefined => (env[key] ? Number(env[key]) : undefined);

const decodeEnv = (
  env: Record<string, string | undefined>
): Record<string, unknown> => ({
  CHECK_STATUS_ADDITIONAL_ATTEMPTS: getNumber(
    env,
    "CHECK_STATUS_ADDITIONAL_ATTEMPTS"
  ),
  ENDPOINT_DELAY: getNumber(env, "ENDPOINT_DELAY"),
  NPG_API_KEY: env.NPG_API_KEY,
  PSP_API_KEY: env.PSP_API_KEY
});

const getConfig = (): Config =>
  pipe(
    decodeEnv(process.env),
    Config.decode,
    E.fold(
      e => {
        throw formatValidationErrors(e);
      },
      v => v
    )
  );

export const config = getConfig();
