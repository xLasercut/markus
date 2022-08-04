import axios from 'axios';
import { LOG_BASE } from '../app/logging/log-base';
import { Logger } from '../app/logging/logger';
import { Config } from '../app/config';

class AnimeCache {
  protected _images: Array<string>;
  protected _imagesToSend: Array<string>;
  protected _currentImageCount: number;
  protected _logger: Logger
  protected _config: Config

  constructor(config: Config, logger: Logger) {
    this._images = [];
    this._imagesToSend = [];
    this._currentImageCount = 0;
    this._logger = logger;
    this._config = config
  }

  public async startCache(): Promise<any> {
    this._logger.writeLog(LOG_BASE.ANIME_CACHE_RELOAD, {
      stage: 'start',
      count: 0
    });
    this._images = await this._getImgurAlbumImages();
    this._logger.writeLog(LOG_BASE.ANIME_CACHE_RELOAD, {
      stage: 'finish',
      count: this._images.length
    });
    this._imagesToSend = this._shuffleArray(this._images);
    this._currentImageCount = 0;
  }

  protected async _getImgurAlbumImages(): Promise<string[]> {
    if (this._config.dict.imgurClientId && this._config.dict.imgurAlbumHash) {
      const url = `https://api.imgur.com/3/album/${this._config.dict.imgurAlbumHash}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Client-ID ${this._config.dict.imgurClientId}`
        }
      });

      return response.data.data.images.map((image) => image.link);
    }
    return [];
  }

  public getRandomImage(): string {
    if (this._currentImageCount >= this._imagesToSend.length) {
      this._imagesToSend = this._shuffleArray(this._images);
      this._currentImageCount = 0;
    }

    const imageUrl = this._imagesToSend[this._currentImageCount];
    this._logger.writeLog(LOG_BASE.FETCHED_ANIME_IMAGE, {
      imageUrl: imageUrl
    });
    this._currentImageCount += 1;
    return imageUrl;
  }

  protected _shuffleArray(array: string[]): string[] {
    const shuffledList = [...array];
    let currentIndex = shuffledList.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shuffledList[currentIndex], shuffledList[randomIndex]] = [
        shuffledList[randomIndex],
        shuffledList[currentIndex]
      ];
    }
    return shuffledList;
  }
}

export { AnimeCache };
