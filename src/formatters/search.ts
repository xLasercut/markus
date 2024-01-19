import { AbstractFormatter } from './abstract';
import { EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { COLORS } from '../constants';
import { ItemType } from '../types';

abstract class AbstractSearchFormatter<T extends ItemType> extends AbstractFormatter<T> {
  public generateOutput(
    inputs: T[],
    query: string,
    currentPage: number,
    maxPage: number
  ): InteractionReplyOptions {
    const fields = inputs.map((input) => {
      return {
        name: this._formatItemNames(input),
        value: this._formatItemDescriptions(input) + this._formatUserInfo(input)
      };
    });

    return {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.SUCCESS)
          .setFooter({ text: `Page ${currentPage} of ${maxPage}` })
          .setDescription(`Search query: **${query}**`)
          .setFields(fields)
      ]
    };
  }
}

class ItemSearchFormatter extends AbstractSearchFormatter<ItemType> {
  protected _nameFields = ['type', 'name'];
  protected _descriptionFields = { detail: '', price: '**' };
}

export { ItemSearchFormatter, AbstractSearchFormatter };
