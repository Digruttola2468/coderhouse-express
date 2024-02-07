import winston from "winston";

const customLevelOptions = {
  levels: {
    debug: 4,
    http: 5,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
  },
};

const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.simple(),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.File({
      filename: "./src/log/errors.log",
      level: "info",
    }),
  ],
});

export const middlewareDevLogger = (req, res, next) => {
  req.logger = devLogger;
  req.logger.info(
    `[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

export const middlewareProdLogger = (req, res, next) => {
  req.logger = prodLogger;
  req.logger.info(
    `[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
