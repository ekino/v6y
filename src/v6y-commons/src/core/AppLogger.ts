import * as winston from 'winston';
import 'winston-daily-rotate-file';

const formatStdout = winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
);

const logOptions = {
    logPath: '/v6y/logs',
    logDir: './v6y-logs',
    logAppName: 'V6Y',
    logDisableConsole: false,
    logDisableFileRotate: false,
};

const AppLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        !logOptions.logDisableConsole
            ? new winston.transports.Console({
                  level: 'debug',
                  format: winston.format.combine(
                      winston.format.colorize(),
                      winston.format.simple(),
                  ),
              })
            : undefined,
        !logOptions.logDisableFileRotate
            ? new winston.transports.DailyRotateFile({
                  format: winston.format.combine(winston.format.timestamp(), formatStdout),
                  dirname: logOptions.logDir,
                  filename: `${logOptions.logAppName}-%DATE%.log`,
                  datePattern: 'YYYY-MM-DD',
                  maxSize: '20m',
                  maxFiles: '1d',
              })
            : undefined,
    ].filter((item) => item !== undefined),
});

export default AppLogger;
