import { IItem } from '../interfaces';
import * as lunr from 'lunr';
import { AbstractMarketCache } from './abstract';
import { Config } from '../app/config';
import { Logger } from '../app/logging/logger';

class ItemCache extends AbstractMarketCache<IItem> {
  constructor(config: Config, logger: Logger) {
    super(config, logger);
    this._name = 'item';
    this._fieldsToEncode = ['detail', 'price'];
    this._userPostsApiUrl = config.dict.itemPostsUserApiUrl;
    this._postsApiUrl = config.dict.itemPostsApiUrl;
  }

  protected _generateSearchIndex(posts: IItem[]): lunr.Index {
    const searchFields = [
      'name',
      'type',
      'user',
      'slot',
      'character',
      'detail',
      'price',
      'discord',
      'rarity',
      'category'
    ];
    return lunr(function () {
      this.ref('id');
      for (const field of searchFields) {
        this.field(field);
      }

      for (const post of posts) {
        this.add({
          id: post.id,
          name: post.name,
          type: post.type.replace('B>', 'Buy').replace('S>', 'Sell'),
          slot: post.slot,
          character: post.character,
          detail: post.detail,
          price: post.price,
          user: post.displayname,
          discord: post.contact_discord,
          rarity: post.rarity,
          category: post.category
        });
      }
    });
  }
}

export { ItemCache };
