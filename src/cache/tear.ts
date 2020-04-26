import {ITear, ITears} from '../interfaces'
import * as lunr from 'lunr'
import {AbstractMarketCache} from './abstract'

class TearCache extends AbstractMarketCache {
  protected _posts: ITears

  constructor() {
    super('tear', ['price'])
  }

  public search(query: string): Array<ITear> {
    return super.search(query)
  }

  public getUserPosts(userId: string, type: 'buy' | 'sell'): Array<ITear> {
    return super.getUserPosts(userId, type)
  }

  protected _generateSearchIndex(apiData: Array<ITear>): lunr.Index {
    let searchFields = ['name', 'type', 'user', 'slot', 'shape', 'color', 'value', 'character', 'price', 'discord', 'rarity']
    return lunr(function () {
      this.ref('id')
      for (let field of searchFields) {
        this.field(field)
      }

      for (let post of apiData) {
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
        })
      }
    })
  }
}

export {TearCache}
