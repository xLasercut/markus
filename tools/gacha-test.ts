import { GachaRoller } from '../src/cache/gacha/gacha';
import { CONFIG } from '../src/app/config';
import { createLogger } from 'winston';
import { LOG_FORMAT, LOGGER_TRANSPORTS } from '../src/app/logger';
import * as fs from 'fs';

const logger = createLogger({
  level: CONFIG.LOG_LEVEL,
  format: LOG_FORMAT,
  transports: LOGGER_TRANSPORTS
});

const gachaRoller = new GachaRoller(CONFIG, logger);

gachaRoller
  .roll(85)
  .then((data) => {
    console.log(data.fiveStarPity)
    fs.writeFileSync('./image.png', data.image);
  })
  .catch((err) => {
    console.log(err);
  });
