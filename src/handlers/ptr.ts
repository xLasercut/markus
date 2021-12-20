import {AbstractCommandHandler} from './abtract'
import {SlashCommandBuilder} from '@discordjs/builders'
import {COLORS} from '../app/constants'
import {MessageEmbed} from 'discord.js'

class PtrHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('ptr')
      .setDescription('Push the rules!')
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setImage('https://i.imgur.com/X7aB8pQ.png')
          .setColor(COLORS.SUCCESS)
      ]
    })
  }
}

export {PtrHandler}
