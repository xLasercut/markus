import { ITear } from '../interfaces';
import * as lunr from 'lunr';
import { AbstractMarketCache } from './abstract';
import { Config } from '../app/config';
import { Logger } from '../app/logging/logger';

class TearCache extends AbstractMarketCache<ITear> {
  constructor(config: Config, logger: Logger) {
    super(config, logger);
    this._name = 'tear';
    this._fieldsToEncode = ['price'];
    this._postsApiUrl = config.dict.tearPostsApiUrl;
    this._userPostsApiUrl = config.dict.tearPostsUserApiUrl;
  }

  protected _generateSearchIndex(posts: ITear[]): lunr.Index {
    const searchFields = [
      'name',
      'type',
      'user',
      'slot',
      'shape',
      'color',
      'value',
      'character',
      'price',
      'discord',
      'rarity'
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
          price: post.price,
          user: post.displayname,
          discord: post.contact_discord,
          color: post.color,
          shape: post.shape,
          value: post.value,
          rarity: post.rarity
        });
      }
    });
  }
}

export { TearCache };
