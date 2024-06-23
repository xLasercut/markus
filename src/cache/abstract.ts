import lunr from 'lunr';
import * as cron from 'node-cron';
import { POST_TYPES } from '../constants';
import { shuffleArray } from '../helper';
import { TConfig, TItem, TPost, TUserItem } from '../types';
import { Logger } from 'winston';

abstract class AbstractMarketCache<T extends TItem, UT extends TUserItem> {
  protected _searchIndex: lunr.Index;
  protected _loading = false;
  protected _reloadTask: cron.ScheduledTask;
  protected _config: TConfig;
  protected _logger: Logger;
  protected _userPosts: Record<string, { buy: string[]; sell: string[] }> = {};
  protected _posts: Record<string, T> = {};
  protected abstract _fieldsToEncode: string[];
  protected abstract _name: string;

  constructor(config: TConfig, logger: Logger) {
    this._config = config;
    this._logger = logger;
  }

  public get loading(): boolean {
    return this._loading;
  }

  public search(query: string): T[] {
    const results = this._searchIndex.search(query);
    return results.map((result) => {
      return this._posts[result.ref];
    });
  }

  public getUserPosts(userId: string, type: TPost): T[] {
    if (userId in this._userPosts) {
      return this._userPosts[userId][type].map((postId) => {
        return this._posts[postId];
      });
    }
    return [];
  }

  public getUserList(): string[] {
    return shuffleArray<string>(Object.keys(this._userPosts));
  }

  public async startCache(): Promise<void> {
    if (this._reloadTask) {
      this._reloadTask.stop();
    }
    await this._reloadCache();
    this._reloadTask = cron.schedule(this._config.CACHE_REFRESH_RATE, async () => {
      await this._reloadCache();
    });
  }

  protected abstract _generateSearchIndex(apiData: T[]): lunr.Index;

  protected abstract _getApiPosts(): Promise<T[]>;

  protected abstract _getApiUserPosts(): Promise<Record<string, UT[]>>;

  protected async _reloadCache(): Promise<void> {
    try {
      this._logger.info('market cache reload start', {
        type: this._name,
        rate: this._config.CACHE_REFRESH_RATE
      });
      this._loading = true;

      await this._reloadPosts();
      await this._reloadUserPosts();

      this._logger.info('market cache reload finished', {
        type: this._name,
        rate: this._config.CACHE_REFRESH_RATE
      });

      this._loading = false;
    } catch (e) {
      this._logger.error('market cache reload failed', e);
      this._loading = false;
    }
  }

  protected async _reloadPosts(): Promise<void> {
    const apiPosts: T[] = await this._getApiPosts();
    this._posts = {};

    for (const apiPost of apiPosts) {
      this._posts[apiPost.id] = this._decodeHtml(apiPost);
    }

    this._searchIndex = this._generateSearchIndex(apiPosts);
  }

  protected async _reloadUserPosts(): Promise<void> {
    const apiUserPosts = await this._getApiUserPosts();
    this._userPosts = {};

    for (const userId in apiUserPosts) {
      this._userPosts[userId] = {
        buy: [],
        sell: []
      };
      this._userPosts[userId][POST_TYPES.BUY] = apiUserPosts[userId]
        .filter((post) => post.type === 'B>')
        .map((post) => post.id);

      this._userPosts[userId][POST_TYPES.SELL] = apiUserPosts[userId]
        .filter((post) => post.type === 'S>')
        .map((post) => post.id);
    }
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
