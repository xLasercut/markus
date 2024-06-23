import * as path from 'path';

const BASE_DIR = path.join(__dirname, '../../');
const CONFIG_FILEPATH = path.join(BASE_DIR, 'config', 'config.json');
const LOG_DIR = path.join(BASE_DIR, 'log');
const GACHA_DIR = path.join(BASE_DIR, 'gacha');

export { BASE_DIR, CONFIG_FILEPATH, LOG_DIR, GACHA_DIR };
