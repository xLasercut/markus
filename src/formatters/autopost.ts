import { EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { COLORS } from '../constants';
import { AbstractFormatter } from './abstract';
import { TItem } from '../types';

abstract class AbstractAutoPostFormatter<T extends TItem> extends AbstractFormatter<T> {
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
          .setColor(COLORS.PRIMARY)
          .setFields(fields)
      ]
    };
  }
}

class AutoPostItemFormatter extends AbstractAutoPostFormatter<TItem> {
  protected _nameFields = ['name'];
  protected _descriptionFields = { detail: '', price: '**' };
}

export { AbstractAutoPostFormatter, AutoPostItemFormatter };
