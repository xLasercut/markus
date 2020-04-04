import * as fs from 'fs'
import {BOT_CONFIG_PATH} from './paths'

const BOT_CONFIG = JSON.parse(fs.readFileSync(BOT_CONFIG_PATH, {encoding: 'utf-8'}))
const ITEM_API_ENDPOINT = 'https://www.ashal.eu/market/api/items.php'
const ELTEAR_API_ENDPOINT = 'https://www.ashal.eu/market/api/tears.php'

export {BOT_CONFIG, ITEM_API_ENDPOINT, ELTEAR_API_ENDPOINT}
