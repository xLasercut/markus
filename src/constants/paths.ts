import * as path from 'path'

const BASE_DIR = path.join(__dirname, '../../')


const BOT_DATA_DIR = path.join(BASE_DIR, 'data')
const LOG_DIR = path.join(BASE_DIR, 'log')

const BOT_CONFIG_PATH = path.join(BOT_DATA_DIR, 'config.json')

export {BOT_CONFIG_PATH, LOG_DIR}
