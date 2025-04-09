import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface TransformableInfo {
    level: string;
    message: unknown;
    [key: string | symbol]: unknown;
}

// Format pour le terminal avec timestamp, label et niveau
const formatStdout = winston.format.printf((info: TransformableInfo) => {
    const { timestamp, level, message, label } = info;
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// Format personnalisé pour gérer plusieurs arguments
const formatArgs = winston.format((info) => {
    if (info.splat) {
        const args = [info.message, ...((info.splat as unknown[]) || [])];
        info.message = args
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
            .join(' ');
        delete info.splat;
    }
    return info;
});

const logOptions = {
    logPath: '/v6y/logs',
    logDir: './v6y-logs',
    logAppName: 'V6Y',
    logDisableConsole: false,
    logDisableFileRotate: true,
};

const AppLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(formatArgs(), winston.format.json()),
    transports: [
        !logOptions.logDisableConsole
            ? new winston.transports.Console({
                  level: 'debug',
                  format: winston.format.combine(
                      formatArgs(),
                      winston.format.colorize(),
                      winston.format.simple(),
                  ),
              })
            : undefined,
        !logOptions.logDisableFileRotate
            ? new winston.transports.DailyRotateFile({
                  format: winston.format.combine(
                      formatArgs(),
                      winston.format.timestamp(),
                      formatStdout,
                  ),
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
