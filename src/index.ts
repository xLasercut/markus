import {client, config, logger, rest} from './app/init'
import {MessageComponentInteraction} from 'discord.js'
import {LOG_BASE} from './app/logging'
import {Routes} from 'discord-api-types/v9'
import {commands, handlers} from './handlers/init'
import {reloadCache} from './cache/init'

client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.on('interactionCreate', async (interaction: MessageComponentInteraction) => {
  if (interaction.isCommand()) {
    const {commandName} = interaction

    if (!(commandName in handlers)) {
      return
    }

    try {
      await handlers[commandName].executeCommand(interaction)
    }
    catch (error) {
      logger.writeLog(LOG_BASE.SERVER002, {reason: error})
    }
  }
  return
})

client.login(config.dict.discordToken)
  .then(() => {
    return rest.put(Routes.applicationCommands(config.dict.applicationId), { body: [] })
  })
  .then(() => {
    return rest.put(Routes.applicationGuildCommands(config.dict.applicationId, config.dict.serverId), { body: commands })
  })
  .then(() => {
    logger.writeLog(LOG_BASE.SERVER005)
    return reloadCache()
  })
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
