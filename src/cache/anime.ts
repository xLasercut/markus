import { getRandomItem, shuffleArray } from '../helper';
import { Logger } from 'winston';
import { AtomicType } from '../interfaces/anime-cache';
import axios from 'axios';
import { ImgurApiResponse } from '../models';
import { ConfigType } from '../interfaces/config';

const ATOMIC_IMAGES: AtomicType[] = [
  {
    title: 'ᵃᵗᵒᵐⁱᶜ',
    image: 'https://media.tenor.com/8tIYSYOsxtcAAAAC/i-am-atomic-eminence-in-shadow.gif'
  },
  { title: 'THE ALL RANGE...\nᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/ZhmtllT.jpg' },
  { title: 'RECOVERY ᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/8VNgF3X.png' },
  { title: 'ᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/THvN4ln.gif' }
];

class AnimeCache {
  protected _config: ConfigType;
  protected _dontGetAttachedImages: string[] = [];
  protected _dontGetAttachedImagesToSend: string[] = [];
  protected _dontGetAttachedCurrentImage: number = 0;
  protected _imageOverrideUrl: string = '';
  protected _imageOverride: boolean = false;
  protected _logger: Logger;

  constructor(config: ConfigType, logger: Logger) {
    this._logger = logger;
    this._config = config;
  }

  public async startCache() {
    this._logger.info('loading anime cache...');
    const headers = {
      Authorization: `Client-ID ${this._config.IMGUR_CLIENT_ID}`
    };
    const response = await axios.get(
      `https://api.imgur.com/3/album/${this._config.IMGUR_ALBUM_ID}`,
      { headers: headers }
    );
    const parsedResponse = ImgurApiResponse.parse(response.data);
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

  public getAtomic(): AtomicType {
    return getRandomItem<AtomicType>(ATOMIC_IMAGES);
  }
}

export { AnimeCache };
