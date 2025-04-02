import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface TransformableInfo {
    level: string;
    message: unknown;
    [key: string | symbol]: unknown;
}

const formatStdout = winston.format.printf((info: TransformableInfo) => {
    const { timestamp, level, message, label } = info;
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logOptions = {
    logPath: '/v6y/logs',
    logDir: './v6y-logs',
    logAppName: 'V6Y',
    logDisableConsole: false,
    logDisableFileRotate: true,
};

const logger = winston.createLogger({
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

// Wrapper around winston logger to handle multiple arguments
const AppLogger = {
    info: (...args: unknown[]) => {
        const message = args
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
            .join(' ');
        logger.info(message);
    },
    warn: (...args: unknown[]) => {
        const message = args
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
            .join(' ');
        logger.warn(message);
    },
    error: (...args: unknown[]) => {
        const message = args
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
            .join(' ');
        logger.error(message);
    },
    debug: (...args: unknown[]) => {
        const message = args
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
            .join(' ');
        logger.debug(message);
    },
};

export default AppLogger;
