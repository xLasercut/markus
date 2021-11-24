import {AbstractCommandHandler} from './abtract'
import {SlashCommandBuilder} from '@discordjs/builders'

class GenshinCalcHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('genshin_calc')
      .setDescription('Genshin calculator')
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply('https://genshin.ashal.eu/equip')
  }
}

export {GenshinCalcHandler}
