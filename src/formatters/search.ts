import { AbstractFormatter } from './abstract';
import { IItem, ITear } from '../interfaces';
import { InteractionReplyOptions, MessageEmbed } from 'discord.js';
import { COLORS } from '../app/constants';

abstract class AbstractSearchFormatter<T extends IItem | ITear> extends AbstractFormatter<T> {
  protected constructor(nameFields: string[], descriptionFields: { [key: string]: string } = {}) {
    super(nameFields, descriptionFields);
  }

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
        new MessageEmbed()
          .setColor(COLORS.SUCCESS)
          .setFooter({ text: `Page ${currentPage} of ${maxPage}` })
          .setDescription(`Search query: **${query}**`)
          .setFields(fields)
      ]
    };
  }
}

class ItemSearchFormatter extends AbstractSearchFormatter<IItem> {
  constructor() {
    const itemFields = ['type', 'name'];
    const optionalFields = { detail: '', price: '**' };
    super(itemFields, optionalFields);
  }
}

class TearSearchFormatter extends AbstractSearchFormatter<ITear> {
  constructor() {
    const itemFields = ['type', 'name', 'value', 'color', 'slot'];
    const optionalFields = { price: '**' };
    super(itemFields, optionalFields);
  }
}

export { ItemSearchFormatter, TearSearchFormatter, AbstractSearchFormatter };
