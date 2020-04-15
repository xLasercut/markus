import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import * as mustache from 'mustache'
import {LOG_DIR} from './paths'
import {ILog} from './interfaces'

let {combine, timestamp, printf} = winston.format

let logFormat = printf(({level, message, timestamp}) => {
  return `${timestamp} | ${level} | ${message}`
})

let botLog = new DailyRotateFile({
  frequency: '24h',
  filename: 'bot-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: LOG_DIR,
  maxFiles: '5',
  level: 'debug'
})

let logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    botLog,
    new winston.transports.Console()
  ]
})


const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
}

const LOG_BASE = {
  SERVER001: {
    code: 'SERVER001',
    level: LOG_LEVEL.INFO,
    template: 'Logged in as {{user}}'
  },
  CACHE001: {
    code: 'CACHE001',
    level: LOG_LEVEL.INFO,
    template: 'market cache reload - type="{{type}}" stage="{{stage}}" rate="{{rate}}"'
  },
  CACHE002: {
    code: 'CACHE0002',
    level: LOG_LEVEL.ERROR,
    template: 'market cache reload failed - status="{{status}}" error="{{error}}"'
  },
  CACHE003: {
    code: 'CACHE003',
    level: LOG_LEVEL.INFO,
    template: 'user cache reload - stage="{{stage}}" rate="{{rate}}"'
  },
  SERVER002: {
    code: 'SERVER002',
    level: LOG_LEVEL.ERROR,
    template: 'server error - type="{{type}}" reason="{{reason}}" message="{{message}}"'
  },
  SERVER003: {
    code: 'SERVER003',
    level: LOG_LEVEL.ERROR,
    template: 'could not connect to discord - reason="{{reason}}"'
  },
  SERVER004: {
    code: 'SERVER004',
    level: LOG_LEVEL.INFO,
    template: 'admin command - command="{{command}}" user="{{user}}" id="{{id}}"'
  },
  AUTO001: {
    code: 'AUTO001',
    level: LOG_LEVEL.INFO,
    template: 'autopost operation - type="{{type}}" status="{{status}}" rate="{{rate}}"'
  },
  AUTO002: {
    code: 'AUTO002',
    level: LOG_LEVEL.INFO,
    template: 'added user to autopost - type="{{type}}" id="{{id}}"'
  },
  SEARCH001: {
    code: 'SEARCH001',
    level: LOG_LEVEL.INFO,
    template: 'search - type="{{type}}" user="{{user}}" message="{{message}}"'
  }
}

class Logger {

  public writeLog(logConfig: ILog, variables: object = {}): void {
    let logMsg = `${logConfig.code} | ${mustache.render(logConfig.template, variables)}`
    switch (logConfig.level) {
      case LOG_LEVEL.INFO:
        logger.info(logMsg)
        break
      case LOG_LEVEL.WARN:
        logger.warn(logMsg)
        break
      case LOG_LEVEL.DEBUG:
        logger.debug(logMsg)
        break
      default:
        logger.error(logMsg)
        break
    }
  }
}

export {Logger, LOG_BASE}
