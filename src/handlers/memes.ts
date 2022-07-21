import { AbstractCommandHandler } from './abtract';
import { SlashCommandBuilder } from '@discordjs/builders';
import { COLORS } from '../app/constants';
import { InteractionReplyOptions, MessageEmbed, User } from 'discord.js';
import { Config } from '../app/config';

class PtrHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    const command = new SlashCommandBuilder().setName('ptr').setDescription('Push the rules!');
    super(command, config);
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [
        new MessageEmbed().setImage('https://i.imgur.com/X7aB8pQ.png').setColor(COLORS.SUCCESS)
      ]
    });
  }
}

class BonkHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    const command = new SlashCommandBuilder()
      .setName('bonk')
      .setDescription('BONK!')
      .addUserOption((option) => {
        return option.setName('user').setDescription('Select a user');
      });
    super(command, config);
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setImage(
            'https://cdn.discordapp.com/attachments/200128243200688129/966950355000758342/bonk.png'
          )
          .setColor(COLORS.WARNING)
      ]
    };

    if (user) {
      response.content = `<@${user.id}>, BONK`;
    }
    return interaction.reply(response);
  }
}

class ChristianServerHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    const command = new SlashCommandBuilder().setName('christian_server').setDescription('AMEN!');
    super(command, config);
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const response: InteractionReplyOptions = {
      embeds: [new MessageEmbed().setImage('https://i.imgur.com/xDw8nXF.png').setColor(COLORS.INFO)]
    };
    return interaction.reply(response);
  }
}

export { PtrHandler, BonkHandler, ChristianServerHandler };
