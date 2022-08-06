import { LOG_BASE } from '../app/logging/log-base';
import * as lunr from 'lunr';
import * as cron from 'node-cron';
import { IItem, IRawUserPosts, ITear, IUserPosts } from '../interfaces';
import { Config } from '../app/config';
import { Logger } from '../app/logging/logger';
import axios from 'axios';
import { POST_TYPES } from '../app/constants';
import { shuffleArray } from '../helper';

abstract class AbstractMarketCache<T extends IItem | ITear> {
  protected _searchIndex: lunr.Index;
  protected _loading = false;
  protected _reloadTask: cron.ScheduledTask;
  protected _config: Config;
  protected _logger: Logger;
  protected _userPosts: IUserPosts;
  protected _posts: { [key: number]: T };
  protected _userPostsApiUrl: string;
  protected _postsApiUrl: string;
  protected _fieldsToEncode: string[];
  protected _name: string;

  protected constructor(config: Config, logger: Logger) {
    this._config = config;
    this._logger = logger;
  }

  public isLoading(): boolean {
    return this._loading;
  }

  public search(query: string): T[] {
    const results = this._searchIndex.search(query);
    return results.map((result) => {
      return this._posts[result.ref];
    });
  }

  public getUserPosts(userId: string, type: 'buy' | 'sell'): T[] {
    if (userId in this._userPosts) {
      return this._userPosts[userId][type].map((postId) => {
        return this._posts[postId];
      });
    }
    return [];
  }

  public getUserList(): string[] {
    return shuffleArray(Object.keys(this._userPosts));
  }

  public async startCache(): Promise<void> {
    if (this._reloadTask) {
      this._reloadTask.stop();
    }
    await this._reloadCache();
    this._reloadTask = cron.schedule(this._config.dict.cacheRefreshRate, async () => {
      await this._reloadCache();
    });
  }

  protected async _reloadCache(): Promise<void> {
    try {
      this._logger.writeLog(LOG_BASE.MARKET_CACHE_RELOAD, {
        type: this._name,
        stage: 'start',
        rate: this._config.dict.cacheRefreshRate
      });
      this._loading = true;
      const body = JSON.stringify({
        password: this._config.dict.apiPassword
      });

      await this._reloadPosts(body);
      await this._reloadUserPosts(body);

      this._logger.writeLog(LOG_BASE.MARKET_CACHE_RELOAD, {
        type: this._name,
        stage: 'finish',
        rate: this._config.dict.cacheRefreshRate
      });

      this._loading = false;
    } catch (e) {
      this._logger.writeLog(LOG_BASE.MARKET_CACHE_RELOAD_FAILED, {
        error: e
      });
      this._loading = false;
    }
  }

  protected async _reloadPosts(body): Promise<void> {
    const response = await axios.post(this._postsApiUrl, body);
    const posts: T[] = Array.isArray(response.data.posts) ? response.data.posts : [];

    this._posts = {};

    for (const post of posts) {
      this._posts[post.id] = this._decodeHtml(post);
    }

    this._searchIndex = this._generateSearchIndex(posts);
  }

  protected async _reloadUserPosts(body): Promise<void> {
    const response = await axios.post(this._userPostsApiUrl, body);
    const userPosts: IRawUserPosts = response.data.users ? response.data.users : {};
    this._userPosts = {};

    for (const userId in userPosts) {
      this._userPosts[userId] = {
        buy: [],
        sell: []
      };
      this._userPosts[userId][POST_TYPES.BUY] = userPosts[userId]
        .filter((post) => post.type === 'B>')
        .map((post) => post.id);

      this._userPosts[userId][POST_TYPES.SELL] = userPosts[userId]
        .filter((post) => post.type === 'S>')
        .map((post) => post.id);
    }
  }

  protected _generateSearchIndex(apiData: T[]): lunr.Index {
    throw new Error('Not implemented');
  }

  protected _decodeHtml(post: T): T {
    const itemEncoded = Object.assign({}, post);
    for (const field of this._fieldsToEncode) {
      itemEncoded[field] = this._decodeHtmlString(itemEncoded[field]);
    }
    return itemEncoded;
  }

  protected _decodeHtmlString(inputString: string): string {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\\/': '&sol;',
      "'": '&apos;'
    };

    let outputString = inputString;
    for (const key in map) {
      outputString = outputString.replace(new RegExp(map[key], 'g'), key);
    }
    return outputString;
  }
}

export { AbstractMarketCache };
