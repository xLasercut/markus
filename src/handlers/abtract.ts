import { ChatInputCommandInteraction, Client } from 'discord.js';
import { TConfig, TDiscordCommand } from '../types';
import { THandlerDependencies } from '../interfaces/handler';
import { Logger } from 'winston';

abstract class AbstractCommandHandler {
  protected abstract _command: TDiscordCommand;
  protected _allowedChannels: string[];
  protected _allowedUsers: string[];
  protected _config: TConfig;
  protected _logger: Logger;
  protected _client: Client;

  constructor(
    dependencies: THandlerDependencies,
    allowedChannels: string[] = [],
    allowedUsers: string[] = []
  ) {
    this._allowedChannels = allowedChannels;
    this._allowedUsers = allowedUsers;
    this._config = dependencies.config;
    this._logger = dependencies.logger;
    this._client = dependencies.client;
  }

  get name(): string {
    return this._command.name;
  }

  get command(): TDiscordCommand {
    return this._command;
  }

  protected _isNotAllowedUser(userId: string): boolean {
    return this._allowedUsers.length > 0 && !this._allowedUsers.includes(userId);
  }

  protected _isNotAllowedChannel(channelId: string): boolean {
    return (
      this._allowedChannels.length > 0 &&
      !this._allowedChannels.includes(channelId) &&
      channelId !== this._config.TEST_CHANNEL_ID
    );
  }

  public async executeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    if (this._isNotAllowedUser(interaction.user.id)) {
      this._logger.warn('user not allowed', {
        user: interaction.user,
        command: interaction.commandName,
        channel: interaction.channelId
      });
      await interaction.reply({
        content: 'You do not have permission to use this command',
        ephemeral: true
      });
      return;
    }

    if (this._isNotAllowedChannel(interaction.channelId)) {
      const allowedChannels = this._allowedChannels.map((channelId) => {
        return `<#${channelId}>`;
      });
      this._logger.warn('channel not allowed', {
        user: interaction.user,
        command: interaction.commandName,
        channel: interaction.channelId
      });
      await interaction.reply({
        content: `This command can only be used in channel(s): ${allowedChannels.join(', ')}`,
        ephemeral: true
      });
      return;
    }

    this._logger.info('running command', {
      user: interaction.user,
      command: interaction.commandName,
      channel: interaction.channelId
    });
    await this._runWorkflow(interaction);
  }

  protected abstract _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void>;

  protected async _wait(time: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}

export { AbstractCommandHandler };
