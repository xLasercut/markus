import {AbstractCommandHandler} from './abtract'
import {SlashCommandBuilder} from '@discordjs/builders'

class ElswordCalcHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('elsword_calc')
      .setDescription('Elsword calculator')
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply('https://ashal.eu/calcs/equip')
  }
}

export {ElswordCalcHandler}
