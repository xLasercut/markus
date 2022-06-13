import { AbstractCommandHandler } from './abtract'
import { SlashCommandBuilder } from '@discordjs/builders'
import { COLORS } from '../app/constants'
import { InteractionReplyOptions, MessageEmbed, User } from 'discord.js'

class MarketHelpHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('market_help')
      .setDescription('How to access the market')
      .addUserOption((option) => {
        return option.setName('user').setDescription('Select a user')
      })
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user')
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.PRIMARY)
          .setTitle('Market Help')
          .setDescription(
            'We use an external website for the market in this server.\n' +
              '\n' +
              'To access market:\n' +
              '1. Go to https://ashal.eu/market/login to create your market account\n' +
              `2. Read the market rules and verification method in #rules_and_important_stuff`
          )
      ]
    }

    if (user) {
      response.content = `Hey <@${user.id}>`
    }

    return interaction.reply(response)
  }
}

export { MarketHelpHandler }
