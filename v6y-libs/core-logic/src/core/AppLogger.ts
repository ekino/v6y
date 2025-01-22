import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface TransformableInfo {
    level: string;
    message: unknown;
    [key: string | symbol]: unknown;
}

const logOptions = {
    logPath: '/v6y/logs',
    logDir: './v6y-logs',
    logAppName: 'V6Y',
    logDisableConsole: false,
    logDisableFileRotate: false,
};

const formatStdout = winston.format.printf((info: TransformableInfo) => {
    const { timestamp, level, message } = info;
    return `${timestamp} [${logOptions.logAppName}] ${level}: ${message}`;
});

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
