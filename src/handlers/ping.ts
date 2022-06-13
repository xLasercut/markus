import { AbstractCommandHandler } from './abtract'
import { SlashCommandBuilder } from '@discordjs/builders'
import { COLORS } from '../app/constants'
import { MessageEmbed } from 'discord.js'

class PingHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder().setName('ping').setDescription('Pong!')
    super(command)
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [new MessageEmbed().setDescription('Pong!').setColor(COLORS.SUCCESS)]
    })
  }
}

export { PingHandler }
