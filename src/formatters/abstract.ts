import { EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { COLORS } from '../constants';
import { TItem } from '../types';

abstract class AbstractFormatter<T extends TItem> {
  protected abstract _nameFields: string[];
  protected abstract _descriptionFields: Record<string, string>;

  public loadingScreen(): InteractionReplyOptions {
    return {
      embeds: [new EmbedBuilder().setDescription('Processing...').setColor(COLORS.WARNING)]
    };
  }

  public noResultsScreen(): InteractionReplyOptions {
    return {
      embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('No results found.')]
    };
  }

  public updateCacheScreen(): InteractionReplyOptions {
    return {
      embeds: [
        new EmbedBuilder()
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
