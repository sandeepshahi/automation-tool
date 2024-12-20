import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import logger from "./utils/logger";
import { config } from "./config/serverConfig";
import routes from "./routes/routes";

const createServer = (): Application => {
  const app = express();

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(cors());

  // Log all requests in development
  if (config.port !== "production") {
    app.use((req: Request, res: Response, next: NextFunction) => {
      logger.debug(`${req.method} ${req.url}`);
      next();
    });
  }

  // Routes
  app.use("/api", routes);

  // Health Check
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("Server is healthy");
  });

  // Error Handling Middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, { stack: err.stack });
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
};

export default createServer;
