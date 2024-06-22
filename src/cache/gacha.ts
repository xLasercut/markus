import { TConfig } from '../types';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import { TGachaItem } from '../interfaces/gacha';
import { getRandomItem } from '../helper';

const GACHA_ITEMS = {
  BASEBALL_HAT: 'BASBALL_HAT',
  COWBOY_HAT: 'COWBOY_HAT',
  FES: 'FES',
  FEDORA: 'FEDORA',
  TOQUE: 'TOQUE',
  TOP_HAT: 'TOP_HAT'
} as const;

const THREE_STARS = [GACHA_ITEMS.TOQUE, GACHA_ITEMS.BASEBALL_HAT, GACHA_ITEMS.FEDORA];

const FOUR_STARS = [GACHA_ITEMS.FES, GACHA_ITEMS.TOP_HAT];

const FIVE_STARS = [GACHA_ITEMS.COWBOY_HAT];

const IMAGE_MAPS = {
  [GACHA_ITEMS.BASEBALL_HAT]: 'baseball.png',
  [GACHA_ITEMS.COWBOY_HAT]: 'cowboy.png',
  [GACHA_ITEMS.FES]: 'fes.png',
  [GACHA_ITEMS.FEDORA]: 'fedora.png',
  [GACHA_ITEMS.TOQUE]: 'toque.png',
  [GACHA_ITEMS.TOP_HAT]: 'tophat.png'
};

class GachaCache {
  protected _config: TConfig;
  protected _logger: Logger;
  protected _images: Record<string, string>;
  protected _background: string;
  protected _template: string;
  protected _itemBackground: string;
  protected _threeStar: string;
  protected _fourStar: string;
  protected _fiveStar: string;

  constructor(config: TConfig, logger: Logger) {
    this._logger = logger;
    this._config = config;
    this._background = this._loadImage('splash-background.webp');
    this._itemBackground = this._loadImage('resultcard-bg.webp');
    this._threeStar = this._loadImage('threestar.png');
    this._fourStar = this._loadImage('fourstar.png');
    this._fiveStar = this._loadImage('fivestar.png');
    this._template = fs.readFileSync(path.join(this._config.GACHA_DIR, 'index.html'), 'utf-8');
    this._images = {};
    for (const key in IMAGE_MAPS) {
      this._images[key] = this._loadImage(IMAGE_MAPS[key]);
    }
  }

  protected _loadImage(imagePath: string): string {
    const fullPath = path.join(this._config.GACHA_DIR, imagePath);
    const base64Image = fs.readFileSync(fullPath).toString('base64');
    return 'data:image/jpeg;base64,' + base64Image;
  }

  protected _rollGacha(): TGachaItem {
    const roll = Math.floor(Math.random() * 1000);

    if (roll <= 16) {
      const item = getRandomItem(FIVE_STARS);
      return {
        image: this._images[item],
        rarity: 'five-star',
        star: this._fiveStar
      };
    }

    if (roll <= 130) {
      const item = getRandomItem(FOUR_STARS);
      return {
        image: this._images[item],
        rarity: 'four-star',
        star: this._fourStar
      };
    }

    const item = getRandomItem(THREE_STARS);
    return {
      image: this._images[item],
      rarity: 'three-star',
      star: this._threeStar
    };
  }

  protected _doTenRoll(): TGachaItem[] {
    const items: TGachaItem[] = [];

    for (let i = 0; i < 10; i++) {
      items.push(this._rollGacha());
    }

    return items;
  }

  public async generateImage(): Promise<Buffer> {
    const image = (await nodeHtmlToImage({
      html: this._template,
      content: {
        backgroundImage: this._background,
        itemBackgroundImage: this._itemBackground,
        items: this._doTenRoll()
      }
    })) as Buffer;

    return image;
  }
}

export { GachaCache };
