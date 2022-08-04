import { InteractionReplyOptions, MessageEmbed } from 'discord.js';
import { COLORS } from '../app/constants';
import { IItem, ITear } from '../interfaces';

abstract class AbstractFormatter<T extends ITear | IItem> {
  protected _nameFields: string[];
  protected _descriptionFields: { [key: string]: string };

  protected constructor(nameFields: string[], descriptionFields: { [key: string]: string } = {}) {
    this._nameFields = nameFields;
    this._descriptionFields = descriptionFields;
  }

  public generateOutput(
    inputs: T[],
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
          .setDescription('')
          .setFields(fields)
      ]
    };
  }

  public loadingScreen(): InteractionReplyOptions {
    return {
      embeds: [new MessageEmbed().setDescription('Processing...').setColor(COLORS.WARNING)]
    };
  }

  public noResultsScreen(): InteractionReplyOptions {
    return {
      embeds: [new MessageEmbed().setColor(COLORS.ERROR).setDescription('No results found.')]
    };
  }

  public updateCacheScreen(): InteractionReplyOptions {
    return {
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.WARNING)
          .setDescription('Updating items list. Please try again later.')
      ],
      ephemeral: true
    };
  }

  protected _formatItemNames(post: T): string {
    const itemName = [];
    for (const field of this._nameFields) {
      itemName.push(post[field]);
    }
    return itemName.join(' ') || '\u200B';
  }

  protected _formatItemDescriptions(post: T): string {
    const info = [];

    for (const field in this._descriptionFields) {
      const trimmedField = post[field].trim();
      if (trimmedField) {
        info.push(
          `${this._descriptionFields[field]}${trimmedField}${this._descriptionFields[field]}`
        );
      }
    }

    return info.join(' ') || '\u200B';
  }

  protected _formatUserInfo(post: T): string {
    if (post.contact_discord || post.discord_id) {
      const row = ['-'];
      if (post.discord_id && post.discord_id != '0') {
        row.push(`<@${post.discord_id}>`);
      }

      if (post.contact_discord) {
        row.push(`__${post.contact_discord}__`);
      }

      return row.join(' ');
    }
    return `- __${post.displayname}__`;
  }
}

export { AbstractFormatter };
