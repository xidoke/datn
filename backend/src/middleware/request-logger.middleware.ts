import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("user-agent") || "";
    const startTime = Date.now();

    // Capture the original json function
    const originalJson = res.json;
    res.json = function (body) {
      // Restore the original json function
      res.json = originalJson;
      // Capture the response body
      res.locals.body = body;
      // Call the original json function
      return originalJson.call(this, body);
    };

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");
      const responseTime = Date.now() - startTime;
      const responseBody = res.locals.body;

      if (statusCode >= 400) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTime}ms - ${userAgent} ${ip}`,
          responseBody.message || "No error message",
          responseBody.result?.stack || "No stack trace",
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTime}ms - ${userAgent} ${ip}`,
        );
      }
    });

    next();
  }
}
