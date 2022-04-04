declare module "hijackresponse" {

  import * as express from "express";

  import ReadableStream = NodeJS.ReadableStream;
  import WritableStream = NodeJS.WritableStream;

  type HijackedReponse = {
    readable: ReadableStream,
    writable: WritableStream
    destroyAndRestore: () => void
  };

  const hijackResponse: (res: express.Response, next?: express.NextFunction) => Promise<HijackedReponse>;

  export = hijackResponse;
}


