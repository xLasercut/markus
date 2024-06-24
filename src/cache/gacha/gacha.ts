import { TConfig } from '../../types';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import { getRandomItem } from '../../helper';
import { AbstractGachaItem } from './gacha-item';
import { FIVE_STAR_PITY, FIVE_STARS, FOUR_STARS, SIX_STARS, THREE_STARS } from './constants';
import { loadImageToString } from './gacha-helpers';
import { GACHA_IMAGE_DIR } from '../../app/constants';

class GachaRoller {
  protected _config: TConfig;
  protected _logger: Logger;
  protected _background: string;
  protected _template: string;
  protected _itemBackground: string;

  constructor(config: TConfig, logger: Logger) {
    this._logger = logger;
    this._config = config;
    this._background = loadImageToString('splash_background');
    this._itemBackground = loadImageToString('resultcard_bg');
    this._template = fs.readFileSync(path.join(GACHA_IMAGE_DIR, 'index.html'), 'utf-8');
  }

  protected _doSingleRoll(fiveStarPity: number): AbstractGachaItem {
    const roll = Math.floor(Math.random() * 10000);

    if (roll <= 10) {
      return getRandomItem(SIX_STARS);
    }

    if (roll <= 160 || fiveStarPity === FIVE_STAR_PITY) {
      return getRandomItem(FIVE_STARS);
    }

    if (roll <= 1300) {
      return getRandomItem(FOUR_STARS);
    }

    return getRandomItem(THREE_STARS);
  }

  protected _doTenRoll(currentPity: number) {
    const items: AbstractGachaItem[] = [];

    let resetPity = false;
    let resetPityCount = 0;
    for (let i = 1; i < 11; i++) {
      const fiveStarPity = currentPity + i;
      const item = this._doSingleRoll(fiveStarPity);

      if (fiveStarPity === FIVE_STAR_PITY || item.rarity === 5) {
        resetPity = true;
        resetPityCount = 10 - i;
      }

      items.push(item);
    }

    if (resetPity) {
      return {
        items: items.sort((a, b) => b.rarity - a.rarity),
        fiveStarPity: resetPityCount
      };
    }

    return { items: items.sort((a, b) => b.rarity - a.rarity), fiveStarPity: currentPity + 10 };
  }

  public async roll(currentPity: number) {
    const { items, fiveStarPity } = this._doTenRoll(currentPity);
    const image = (await nodeHtmlToImage({
      html: this._template,
      content: {
        backgroundImage: this._background,
        itemBackgroundImage: this._itemBackground,
        items: items.map((item) => item.template)
      },
      puppeteerArgs: {
        args: ['--no-sandbox', '--headless']
      }
    })) as Buffer;

    return { image: image, items: items.map((item) => item.details), fiveStarPity: fiveStarPity };
  }
}

class GachaDatabase {
  protected _config: TConfig;
  protected _logger: Logger;
  protected _rollLocks: Record<string, boolean> = {};
  protected _pities: Record<string, number> = {};

  constructor(config: TConfig, logger: Logger) {
    this._config = config;
    this._logger = logger;
  }

  public getRollLock(discordId: string) {
    return this._rollLocks[discordId] || false;
  }

  public setRollLock(discordId: string, lock: boolean) {
    this._rollLocks[discordId] = lock;
  }

  public getPity(discordId: string) {
    return this._pities[discordId] || 0;
  }

  public setPity(discordId: string, pity: number) {
    this._pities[discordId] = pity;
  }
}

export { GachaRoller, GachaDatabase };
