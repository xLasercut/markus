import { IItem, IItems } from '../interfaces';
import * as lunr from 'lunr';
import { AbstractMarketCache } from './abstract';

class ItemCache extends AbstractMarketCache {
  protected _posts: IItems;

  constructor() {
    super('item', ['detail', 'price']);
  }

  public search(query: string): Array<IItem> {
    return super.search(query);
  }

  public getUserPosts(userId: string, type: 'buy' | 'sell'): Array<IItem> {
    return super.getUserPosts(userId, type);
  }

  protected _generateSearchIndex(apiData: Array<IItem>): lunr.Index {
    let searchFields = [
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
      for (let field of searchFields) {
        this.field(field);
      }

      for (let post of apiData) {
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
