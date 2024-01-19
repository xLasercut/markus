import * as lunr from 'lunr';
import { AbstractMarketCache } from './abstract';
import { ItemType, UserItemType } from '../types';
import axios from 'axios';
import { ItemApiResponse, UserItemApiResponse } from '../models';
import { POST_TYPES } from '../constants';

class ItemCache extends AbstractMarketCache<ItemType, UserItemType> {
  protected _name = 'item';
  protected _fieldsToEncode = ['detail', 'price'];

  protected async _getApiPosts(): Promise<ItemType[]> {
    const response = await axios.post(
      this._config.ITEM_POSTS_API_URL,
      JSON.stringify({
        password: this._config.API_PASSWORD
      })
    );
    const parsedResponse = ItemApiResponse.parse(response.data);
    this._logger.debug('item posts api response', {
      response: parsedResponse
    });
    return parsedResponse.posts;
  }

  protected async _getApiUserPosts(): Promise<Record<string, UserItemType[]>> {
    const response = await axios.post(
      this._config.ITEM_POSTS_USER_API_URL,
      JSON.stringify({
        password: this._config.API_PASSWORD
      })
    );
    const parsedResponse = UserItemApiResponse.parse(response.data);
    this._logger.debug('user item posts api response', {
      response: parsedResponse
    });
    return parsedResponse.users;
  }

  protected _generateSearchIndex(posts: ItemType[]): lunr.Index {
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
          type: post.type.replace('B>', POST_TYPES.BUY).replace('S>', POST_TYPES.SELL),
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
