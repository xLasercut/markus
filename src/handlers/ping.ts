import {AbstractCommandHandler} from './abtract'
import {SlashCommandBuilder} from '@discordjs/builders'

class PingHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Pong!')
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      content: 'Pong!'
    })
  }
}

export {PingHandler}
