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
  MARKUS010: 'MARKUS010'
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
  CACHE002: {
    reference: LOG_REFERENCES.MARKUS003,
    level: LOG_LEVEL.ERROR,
    message: 'market cache reload failed - error="{{{error}}}"'
  },
  CACHE003: {
    reference: LOG_REFERENCES.MARKUS004,
    level: LOG_LEVEL.INFO,
    message: 'user cache reload - stage="{{{stage}}}" rate="{{{rate}}}"'
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
  SERVER004: {
    reference: LOG_REFERENCES.MARKUS009,
    level: LOG_LEVEL.INFO,
    message: 'admin command - command="{{{command}}}" user="{{{user}}}" id="{{{id}}}"'
  },
  REGISTERED_APP_COMMANDS: {
    reference: LOG_REFERENCES.MARKUS010,
    level: LOG_LEVEL.INFO,
    message: 'Successfully registered application commands'
  },
  AUTO001: {
    reference: 'AUTO001',
    level: LOG_LEVEL.INFO,
    message: 'autopost operation - type="{{{type}}}" status="{{{status}}}" rate="{{{rate}}}"'
  },
  AUTO002: {
    reference: 'AUTO002',
    level: LOG_LEVEL.INFO,
    message: 'added user to autopost - type="{{{type}}}" id="{{{id}}}"'
  },
  SEARCH001: {
    reference: 'SEARCH001',
    level: LOG_LEVEL.INFO,
    message:
      'search - type="{{{type}}}" userId="{{{userId}}}" user="{{{user}}}" query="{{{query}}}" channel="{{{channel}}}"'
  },
  EXPIRE001: {
    reference: 'EXPIRE001',
    level: LOG_LEVEL.INFO,
    message: 'expiry notification - users="{{{users}}}" rate="{{{rate}}}"'
  },
  EXPIRE002: {
    reference: 'EXPIRE002',
    level: LOG_LEVEL.INFO,
    message: 'clearing reactivation list - rate="{{{rate}}}"'
  }
};

export { LOG_LEVEL, LOG_BASE };
