import * as http from "http";
import * as App from "./app";
import { logger } from "./logger";

App.newExpressApp()
  .then(app => {
    const server = http.createServer(app);

    logger.info("Starting PM mock...");

    server.listen(8081);
  })
  .catch(error => {
    logger.error(`Error occurred starting server: ${error}`);
  });
