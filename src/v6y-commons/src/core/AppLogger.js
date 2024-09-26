"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
require("winston-daily-rotate-file");
const formatStdout = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);
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
                format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
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
exports.default = AppLogger;
