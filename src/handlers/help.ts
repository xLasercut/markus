import {AbstractCommandHandler} from './abtract'
import {SlashCommandBuilder} from '@discordjs/builders'
import {COLORS} from '../app/constants'

class MarketHelpHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('market_help')
      .setDescription('How to access the market')
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [
        {
          title: 'Market Help',
          description: 'We use an external website for the market in this server.\n' +
            '\n' +
            'To access market:\n' +
            '1. Go to https://ashal.eu/market/login to create your market account\n' +
            `2. Read the market rules and verification method in #rules_and_important_stuff`,
          color: COLORS.PRIMARY
        }
      ]
    })
  }
}

export {MarketHelpHandler}
