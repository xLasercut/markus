import { TConfig } from '../../types';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import { getRandomItem } from '../../helper';
import {
  AbstractGachaItem,
  FiveStarGachaItem,
  FourStarGachaItem,
  SixStarGachaItem,
  ThreeStarGachaItem
} from './gacha-item';
import { FIVE_STARS, FOUR_STARS, IMAGE_MAPS, SIX_STARS, THREE_STARS } from './constants';

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

  protected _doSingleRoll(): AbstractGachaItem {
    const roll = Math.floor(Math.random() * 10000);

    if (roll <= 10) {
      const item = getRandomItem(SIX_STARS);
      return new SixStarGachaItem(this._images[item], item);
    }

    if (roll <= 160) {
      const item = getRandomItem(FIVE_STARS);
      return new FiveStarGachaItem(this._images[item], item);
    }

    if (roll <= 1300) {
      const item = getRandomItem(FOUR_STARS);
      return new FourStarGachaItem(this._images[item], item);
    }

    const item = getRandomItem(THREE_STARS);
    return new ThreeStarGachaItem(this._images[item], item);
  }

  protected _doTenRoll(): AbstractGachaItem[] {
    const items: AbstractGachaItem[] = [];

    for (let i = 0; i < 10; i++) {
      items.push(this._doSingleRoll());
    }

    return items.sort((a, b) => b.rarity - a.rarity);
  }

  public async roll() {
    const items = this._doTenRoll();
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

    return { image: image, items: items.map((item) => item.details) };
  }
}

export { GachaCache };
