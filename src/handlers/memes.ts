import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../app/constants';
import { InteractionReplyOptions, MessageEmbed, User } from 'discord.js';
import { Config } from '../app/config';
import { optionalUserPingCommand, simpleCommand } from './command';

class PtrHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = simpleCommand('ptr', 'Push the rules!');
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
    super(config);
    this._command = optionalUserPingCommand('bonk', 'BONK!');
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
    super(config);
    this._command = simpleCommand('christian_server', 'AMEN!');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const response: InteractionReplyOptions = {
      embeds: [new MessageEmbed().setImage('https://i.imgur.com/xDw8nXF.png').setColor(COLORS.INFO)]
    };
    return interaction.reply(response);
  }
}

export { PtrHandler, BonkHandler, ChristianServerHandler };
