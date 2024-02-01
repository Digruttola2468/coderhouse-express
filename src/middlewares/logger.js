import winston from "winston";

const customLevelOptions = {
  levels: {
    debug: 1,
    http: 2,
    info: 3,
    warning: 4,
    error: 5,
    fatal: 6,
  },
};

const devLogger = winston.createLogger({
  format: winston.format.simple(),
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: "../log/errors.log",
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
