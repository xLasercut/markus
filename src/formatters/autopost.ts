import { IItem, ITear } from '../interfaces';
import { InteractionReplyOptions, EmbedBuilder } from 'discord.js';
import { COLORS } from '../app/constants';
import { AbstractFormatter } from './abstract';

abstract class AbstractAutoPostFormatter<T extends IItem | ITear> extends AbstractFormatter<T> {
  protected constructor(nameFields: string[], descriptionFields: { [key: string]: string } = {}) {
    super(nameFields, descriptionFields);
  }

  public generateOutput(inputs: T[]): InteractionReplyOptions {
    const firstPost = inputs[0];
    const title = [`User: __${firstPost.displayname}__`];
    if (firstPost.contact_discord || firstPost.discord_id) {
      title.push('Discord:');
      if (firstPost.discord_id && firstPost.discord_id != '0') {
        title.push(`<@${firstPost.discord_id}>`);
      }

      if (firstPost.contact_discord) {
        title.push(`__${firstPost.contact_discord}__`);
      }
    }

    const fields = inputs.map((input) => {
      return {
        name: this._formatItemNames(input),
        value: this._formatItemDescriptions(input)
      };
    });

    return {
      embeds: [
        new EmbedBuilder()
          .setDescription(title.join(' '))
          .setFooter({ text: '' })
          .setColor(COLORS.PRIMARY)
          .setFields(fields)
      ]
    };
  }
}

class AutoPostItemFormatter extends AbstractAutoPostFormatter<IItem> {
  constructor() {
    const itemFields = ['name'];
    const optionalFields = { detail: '', price: '**' };
    super(itemFields, optionalFields);
  }
}

class AutoPostTearFormatter extends AbstractAutoPostFormatter<ITear> {
  constructor() {
    const itemFields = ['name', 'value', 'color', 'slot'];
    const optionalFields = { price: '**' };
    super(itemFields, optionalFields);
  }
}

export { AbstractAutoPostFormatter, AutoPostItemFormatter, AutoPostTearFormatter };
