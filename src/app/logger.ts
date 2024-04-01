import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { CONFIG } from './config';

const { combine, timestamp, json, errors } = format;

const LOG_FORMAT = combine(
  timestamp(),
  format((info) => {
    const { timestamp, level, message, ...rest } = info;
    return {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...rest
    };
  })(),
  errors({ stack: true }),
  json({ deterministic: false })
);

const rotateFileTransport = new DailyRotateFile({
  frequency: '24h',
  filename: 'markus-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: CONFIG.LOG_DIR,
  maxFiles: '5'
});

const LOGGER_TRANSPORTS = [rotateFileTransport, new transports.Console()];

export { LOG_FORMAT, LOGGER_TRANSPORTS };
