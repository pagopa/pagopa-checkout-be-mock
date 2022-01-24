import { Response } from "express";
import { Either, map } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

export const splitAt: (index: number, x: string) => ReadonlyArray<string> = (
  index: number,
  x: string
) => [x.slice(0, index), x.slice(index)];

export const tupleWith: <A, D, E>(
  v: D
) => (fa: Either<E, A>) => Either<E, readonly [A, D]> = <A, D, E>(
  v: D
): ((e: Either<E, A>) => Either<E, readonly [A, D]>) => (
  e: Either<E, A>
): Either<E, readonly [A, D]> =>
  pipe(
    e,
    map(r => [r, v])
  );

export const sendResponseWithData: <Data, Locals>([response, data]: readonly [
  Data,
  Response<Data, Locals>
]) => Response<Data, Locals> = ([data, response]) => response.send(data);
