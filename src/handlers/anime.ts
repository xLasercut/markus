import { InteractionReplyOptions, MessageEmbed, User } from 'discord.js'
import { AbstractCommandHandler } from './abtract'
import { SlashCommandBuilder } from '@discordjs/builders'
import { config } from '../app/init'
import { COLORS } from '../app/constants'
import { AnimeCache } from '../cache/anime'
import { animeCache } from '../cache/init'

class DontGetAttachedHandler extends AbstractCommandHandler {
  protected _cache: AnimeCache

  constructor() {
    const command = new SlashCommandBuilder()
      .setName('dont_get_attached')
      .setDescription("Don't get attached!")
      .addUserOption((option) => {
        return option.setName('user').setDescription('Select a user')
      })
    super(command, [config.dict.botsChannelId, config.dict.testChannelId])
    this._cache = animeCache
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user')
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.ERROR)
          .setTitle("DON'T GET ATTACHED")
          .setImage(this._cache.getRandomImage())
      ]
    }
    if (user) {
      response.content = `Hey <@${user.id}>`
    }

    return interaction.reply(response)
  }
}

class AnimeStreamAlertHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('anime_stream_alert')
      .setDescription('Add, remove or ping anime stream role')
      .addStringOption((option) => {
        return option
          .setName('action')
          .setDescription('Select action')
          .setRequired(true)
          .addChoice('Enable', 'enable')
          .addChoice('Disable', 'disable')
          .addChoice('Ping', 'ping')
      })
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const action = interaction.options.getString('action')
    const role = interaction.guild.roles.cache.get(config.dict.animeRoleId)
    if (action === 'enable') {
      await interaction.member.roles.add(role)
      return interaction.reply({
        content: 'Anime stream alert enabled',
        ephemeral: true
      })
    }

    if (action === 'disable') {
      await interaction.member.roles.remove(role)
      return interaction.reply({
        content: 'Anime stream alert disabled',
        ephemeral: true
      })
    }

    if (action === 'ping') {
      const response: InteractionReplyOptions = {
        content: `<@&${config.dict.animeRoleId}> is starting`,
        embeds: [
          new MessageEmbed()
            .setColor(COLORS.INFO)
            .setTitle("It's Anime Time. DON'T BE LATE!")
            .setImage('https://i.imgur.com/R0v1uDe.jpg')
        ]
      }
      return interaction.reply(response)
    }
  }
}

export { DontGetAttachedHandler, AnimeStreamAlertHandler }
