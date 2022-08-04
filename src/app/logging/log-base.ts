const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

const LOG_REFERENCES = {
  MARKUS001: 'MARKUS001',
  MARKUS002: 'MARKUS002',
  MARKUS003: 'MARKUS003',
  MARKUS004: 'MARKUS004',
  MARKUS005: 'MARKUS005',
  MARKUS006: 'MARKUS006',
  MARKUS007: 'MARKUS007',
  MARKUS008: 'MARKUS008',
  MARKUS009: 'MARKUS009',
  MARKUS010: 'MARKUS010',
  MARKUS011: 'MARKUS011',
  MARKUS012: 'MARKUS012'
};

const LOG_BASE = {
  BOT_LOG_IN: {
    reference: LOG_REFERENCES.MARKUS001,
    level: LOG_LEVEL.INFO,
    message: 'bot logged in'
  },
  MARKET_CACHE_RELOAD: {
    reference: LOG_REFERENCES.MARKUS002,
    level: LOG_LEVEL.INFO,
    message: 'market cache reload'
  },
  MARKET_CACHE_RELOAD_FAILED: {
    reference: LOG_REFERENCES.MARKUS003,
    level: LOG_LEVEL.ERROR,
    message: 'market cache reload failed'
  },
  ANIME_CACHE_RELOAD: {
    reference: LOG_REFERENCES.MARKUS005,
    level: LOG_LEVEL.INFO,
    message: 'anime cache reload'
  },
  FETCHED_ANIME_IMAGE: {
    reference: LOG_REFERENCES.MARKUS006,
    level: LOG_LEVEL.INFO,
    message: 'fetched anime image'
  },
  INTERNAL_SERVER_ERROR: {
    reference: LOG_REFERENCES.MARKUS007,
    level: LOG_LEVEL.ERROR,
    message: 'server error'
  },
  DISCORD_LOGIN_ERROR: {
    reference: LOG_REFERENCES.MARKUS008,
    level: LOG_LEVEL.ERROR,
    message: 'could not connect to discord'
  },
  ADMIN_COMMAND: {
    reference: LOG_REFERENCES.MARKUS009,
    level: LOG_LEVEL.INFO,
    message: 'admin command'
  },
  REGISTERED_APP_COMMANDS: {
    reference: LOG_REFERENCES.MARKUS010,
    level: LOG_LEVEL.INFO,
    message: 'Successfully registered application commands'
  },
  AUTOPOST_OPERATION: {
    reference: LOG_REFERENCES.MARKUS012,
    level: LOG_LEVEL.INFO,
    message: 'autopost operation'
  },
  SEARCH_MARKET: {
    reference: LOG_REFERENCES.MARKUS011,
    level: LOG_LEVEL.INFO,
    message: 'search market'
  }
};

export { LOG_LEVEL, LOG_BASE };
