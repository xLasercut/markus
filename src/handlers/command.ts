import { TDiscordCommand } from '../types';
import { SlashCommandBuilder } from 'discord.js';

function simpleCommand(name: string, description: string): TDiscordCommand {
  return new SlashCommandBuilder().setName(name).setDescription(description);
}

function optionalUserPingCommand(name: string, description: string): TDiscordCommand {
  return simpleCommand(name, description).addUserOption((option) => {
    return option.setName('user').setDescription('Select a user');
  });
}

function mandatoryQueryCommand(name: string, description: string): TDiscordCommand {
  return simpleCommand(name, description).addStringOption((option) => {
    return option.setName('query').setDescription('Enter a string').setRequired(true);
  });
}

function mandatoryToggleActionCommand(name: string, description: string): TDiscordCommand {
  return simpleCommand(name, description).addStringOption((option) => {
    return option
      .setName('action')
      .setDescription('Select action')
      .setRequired(true)
      .addChoices({ name: 'Enable', value: 'enable' }, { name: 'Disable', value: 'disable' });
  });
}

function autoPostToggleActionCommand(name: string, description: string): TDiscordCommand {
  return simpleCommand(name, description).addStringOption((option) => {
    return option
      .setName('action')
      .setDescription('Select action')
      .setRequired(true)
      .addChoices(
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' },
        { name: 'Test', value: 'test' }
      );
  });
}

export {
  simpleCommand,
  optionalUserPingCommand,
  mandatoryQueryCommand,
  mandatoryToggleActionCommand,
  autoPostToggleActionCommand
};
