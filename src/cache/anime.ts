import { getRandomItem, shuffleArray } from '../helper';
import { Logger } from 'winston';
import { TAtomic } from '../interfaces/anime-cache';
import axios from 'axios';
import { ImgchestApiResponse } from '../models/api';
import { TConfig } from '../types';

const ATOMIC_IMAGES: TAtomic[] = [
  {
    title: 'ᵃᵗᵒᵐⁱᶜ',
    image: 'https://media.tenor.com/8tIYSYOsxtcAAAAC/i-am-atomic-eminence-in-shadow.gif'
  },
  { title: 'THE ALL RANGE...\nᵃᵗᵒᵐⁱᶜ', image: `https://cdn.imgchest.com/files/ff54a6ea7c76.jpg` },
  { title: 'RECOVERY ᵃᵗᵒᵐⁱᶜ', image: `https://cdn.imgchest.com/files/5a89613e40cc.png` },
  { title: 'ᵃᵗᵒᵐⁱᶜ', image: `https://cdn.imgchest.com/files/98ec99b0f5be.gif` }
];

class AnimeCache {
  protected _config: TConfig;
  protected _dontGetAttachedImages: string[] = [];
  protected _dontGetAttachedImagesToSend: string[] = [];
  protected _dontGetAttachedCurrentImage: number = 0;
  protected _imageOverrideUrl: string = '';
  protected _imageOverride: boolean = false;
  protected _logger: Logger;

  constructor(config: TConfig, logger: Logger) {
    this._logger = logger;
    this._config = config;
  }

  public async startCache() {
    this._logger.info('loading anime cache...');
    const response = await axios.get(
      `https://api.imgchest.com/v1/post/${this._config.IMGCHEST_POST_ID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this._config.IMGCHEST_API_TOKEN}`
        }
      }
    );
    const parsedResponse = ImgchestApiResponse.parse(response.data);
    this._dontGetAttachedImages = parsedResponse.data.images.map((image) => {
      return image.link;
    });
    this._dontGetAttachedImagesToSend = shuffleArray<string>(this._dontGetAttachedImages);
    this._logger.info('anime cache load complete');
  }

  public getDontGetAttachedImage(): string {
    if (this._imageOverride) {
      this._imageOverride = false;
      return this._imageOverrideUrl;
    }

    if (this._dontGetAttachedCurrentImage >= this._dontGetAttachedImagesToSend.length) {
      this._dontGetAttachedImagesToSend = shuffleArray<string>(this._dontGetAttachedImages);
      this._dontGetAttachedCurrentImage = 0;
    }

    const imageUrl = this._dontGetAttachedImagesToSend[this._dontGetAttachedCurrentImage];
    this._logger.info('fetched dont get attached image', {
      imageUrl: imageUrl
    });
    this._dontGetAttachedCurrentImage += 1;
    return imageUrl;
  }

  public set imageOverride(imageUrl: string) {
    this._imageOverrideUrl = imageUrl;
    this._imageOverride = true;
  }

  public getAtomic(): TAtomic {
    return getRandomItem<TAtomic>(ATOMIC_IMAGES);
  }
}

export { AnimeCache };
