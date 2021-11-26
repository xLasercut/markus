import {InteractionReplyOptions, MessageEmbed, User} from 'discord.js'
import {AbstractCommandHandler} from './abtract'
import {SlashCommandBuilder} from '@discordjs/builders'
import {config} from '../app/init'
import {COLORS} from '../app/constants'
import {AnimeCache} from '../cache/anime'
import {animeCache} from '../cache/init'

class DontGetAttachedHandler extends AbstractCommandHandler {
  protected _cache: AnimeCache

  constructor() {
    const command = new SlashCommandBuilder()
      .setName('dont_get_attached')
      .setDescription('Don\'t get attached!')
      .addUserOption((option) => {
        return option
          .setName('user')
          .setDescription('Select a user')
      })
    super(command, [config.dict.botsChannelId])
    this._cache = animeCache
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user')
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.ERROR)
          .setTitle('DON\'T GET ATTACHED')
          .setImage(this._cache.getRandomImage())
      ]
    }
    if (user) {
      response.content = `Hey <@${user.id}>`
    }

    return interaction.reply(response)
  }
}

export {DontGetAttachedHandler}
