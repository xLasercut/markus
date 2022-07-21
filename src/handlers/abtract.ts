import { MessageComponentInteraction } from 'discord.js';
import { DiscordCommand } from '../types';
import { Config } from '../app/config';

class AbstractCommandHandler {
  protected _name: string;
  protected _command: DiscordCommand;
  protected _allowedChannels: string[];
  protected _allowedUsers: string[];
  protected _config: Config;

  constructor(
    command: DiscordCommand,
    config: Config,
    allowedChannels: string[] = [],
    allowedUsers: string[] = []
  ) {
    this._name = command.name;
    this._command = command;
    this._allowedChannels = allowedChannels;
    this._allowedUsers = allowedUsers;
    this._config = config;
  }

  get name(): string {
    return this._name;
  }

  get command(): DiscordCommand {
    return this._command;
  }

  protected _isNotAllowedUser(userId: string): boolean {
    return this._allowedUsers.length > 0 && !this._allowedUsers.includes(userId);
  }

  protected _isNotAllowedChannel(channelId: string): boolean {
    return (
      this._allowedChannels.length > 0 &&
      !this._allowedChannels.includes(channelId) &&
      channelId !== this._config.dict.testChannelId
    );
  }

  public async executeCommand(interaction: MessageComponentInteraction): Promise<any> {
    if (this._isNotAllowedUser(interaction.user.id)) {
      return interaction.reply({
        content: 'You do not have permission to use this command',
        ephemeral: true
      });
    }

    if (this._isNotAllowedChannel(interaction.channelId)) {
      const allowedChannels = this._allowedChannels.map((channelId) => {
        return `<#${channelId}>`;
      });
      return interaction.reply({
        content: `This command can only be used in channel(s): ${allowedChannels.join(', ')}`,
        ephemeral: true
      });
    }

    return this._runWorkflow(interaction);
  }

  protected async _runWorkflow(interaction: MessageComponentInteraction): Promise<any> {
    throw new Error('Not implemented');
  }
}

export { AbstractCommandHandler };
