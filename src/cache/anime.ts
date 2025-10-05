import { getRandomItem, shuffleArray } from '../helper';
import { Logger } from 'winston';
import { TAtomic } from '../interfaces/anime-cache';
import axios from 'axios';
import { GithubImageResponse } from '../models/api';
import { TConfig } from '../types';
import { MEME_IMAGES_BASE_URL } from '../constants';

const ATOMIC_IMAGES: TAtomic[] = [
  {
    title: 'ᵃᵗᵒᵐⁱᶜ',
    image: 'https://media.tenor.com/8tIYSYOsxtcAAAAC/i-am-atomic-eminence-in-shadow.gif'
  },
  { title: 'THE ALL RANGE...\nᵃᵗᵒᵐⁱᶜ', image: `${MEME_IMAGES_BASE_URL}/all-range-atomic.jpg` },
  { title: 'RECOVERY ᵃᵗᵒᵐⁱᶜ', image: `${MEME_IMAGES_BASE_URL}/recovery-atomic.png` },
  { title: 'ᵃᵗᵒᵐⁱᶜ', image: `${MEME_IMAGES_BASE_URL}/im-atomic.gif` }
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
      `https://api.github.com/repos/xLasercut/server-images/contents/dont-get-attached`
    );
    const parsedResponse = GithubImageResponse.parse(response.data);
    this._dontGetAttachedImages = parsedResponse.map((image) => {
      return image.download_url;
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
