import {AbstractCommandHandler} from './abtract'
import {SlashCommandBuilder} from '@discordjs/builders'
import {COLORS} from '../app/constants'
import {InteractionReplyOptions, MessageEmbed, User} from 'discord.js'

class GenshinCalcHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('genshin_calc')
      .setDescription('Genshin calculator')
      .addUserOption((option) => {
        return option
          .setName('user')
          .setDescription('Select a user')
      })
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user')
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.PRIMARY)
          .setDescription('https://genshin.ashal.eu/equip')
          .setTitle('If only there was a calculator for that')
      ]
    }

    if (user) {
      response.content = `Hey <@${user.id}>`
    }

    return interaction.reply(response)
  }
}

export {GenshinCalcHandler}
