import * as path from 'path'

const BASE_DIR = path.join(__dirname, '../')

const LOG_DIR = path.join(BASE_DIR, 'log')
const DATA_DIR = path.join(BASE_DIR, 'data')

const CONFIG_PATH = path.join(DATA_DIR, 'config.json')

export {LOG_DIR, CONFIG_PATH}
