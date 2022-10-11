import { DiscordCommand } from '../types';
import { SlashCommandBuilder } from '@discordjs/builders';

function simpleCommand(name: string, description: string): DiscordCommand {
  return new SlashCommandBuilder().setName(name).setDescription(description);
}

function optionalUserPingCommand(name: string, description: string): DiscordCommand {
  return simpleCommand(name, description).addUserOption((option) => {
    return option.setName('user').setDescription('Select a user');
  });
}

function mandatoryQueryCommand(name: string, description: string): DiscordCommand {
  return simpleCommand(name, description).addStringOption((option) => {
    return option.setName('query').setDescription('Enter a string').setRequired(true);
  });
}

function mandatoryToggleActionCommand(name: string, description: string): DiscordCommand {
  return simpleCommand(name, description).addStringOption((option) => {
    return option
      .setName('action')
      .setDescription('Select action')
      .setRequired(true)
      .addChoice('Enable', 'enable')
      .addChoice('Disable', 'disable');
  });
}

export {
  simpleCommand,
  optionalUserPingCommand,
  mandatoryQueryCommand,
  mandatoryToggleActionCommand
};