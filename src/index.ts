import * as http from "http";
import * as App from "./app";
import { logger } from "./logger";

App.newExpressApp()
  .then(app => {
    const listeningPorts = [8080, 8081];

    logger.info("Starting PM mock...");

    for (const port of listeningPorts) {
      const server = http.createServer(app);
      server.listen(port, "0.0.0.0");
    }
  })
  .catch(error => {
    logger.error(`Error occurred starting server: ${error}`);
  });
