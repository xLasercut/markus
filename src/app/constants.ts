import * as path from 'path';

const BASE_DIR = path.join(__dirname, '../../');
const CONFIG_FILEPATH = path.join(BASE_DIR, 'config', 'config.json');
const LOG_DIR = path.join(BASE_DIR, 'log');
const GACHA_DIR = path.join(BASE_DIR, 'gacha');
const GACHA_IMAGE_DIR = path.join(GACHA_DIR, 'images');
const GACHA_DATA_DIR = path.join(GACHA_DIR, 'data');

export { BASE_DIR, CONFIG_FILEPATH, LOG_DIR, GACHA_DIR, GACHA_IMAGE_DIR, GACHA_DATA_DIR };
