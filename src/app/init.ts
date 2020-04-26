import {Logger} from './logging'
import {Config} from './config'
import * as Discord from 'discord.js'

const client = new Discord.Client()
const logger = new Logger()
const config = new Config(logger)


export {client, logger, config}
