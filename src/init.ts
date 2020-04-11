import {Logger} from './logging'
import {Config} from './config'
import * as Discord from 'discord.js'
import {ItemCache, TearCache} from './market-cache'

const client = new Discord.Client()
const logger = new Logger()
const config = new Config(logger)
const itemCache = new ItemCache(logger, config)
const tearCache = new TearCache(logger, config)


export {client, logger, config, itemCache, tearCache}
