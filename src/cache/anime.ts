import { LOG_BASE } from '../app/logging/log-base';
import { Logger } from '../app/logging/logger';
import { Config } from '../app/config';
import { shuffleArray } from '../helper';
import * as Database from 'better-sqlite3';
import { Database as SqliteDb } from 'better-sqlite3';
import * as path from 'path';

function _databaseConnection(currentDb: SqliteDb | null, filepath: string): SqliteDb {
  if (currentDb) {
    currentDb.close();
  }
  const db = new Database(filepath);
  db.pragma('journal_mode = WAL');
  return db;
}

class AnimeCache {
  protected _images: Array<string>;
  protected _imagesToSend: Array<string>;
  protected _currentImageCount: number;
  protected _logger: Logger;
  protected _config: Config;
  protected _db: SqliteDb;
  protected _filepath: string;

  constructor(config: Config, logger: Logger) {
    this._images = [];
    this._imagesToSend = [];
    this._currentImageCount = 0;
    this._logger = logger;
    this._config = config;
    this._filepath = path.join(config.dict.dataDir, 'markus.db');
    this._db = _databaseConnection(this._db, this._filepath);
  }

  public async startCache(): Promise<any> {
    this._db = _databaseConnection(this._db, this._filepath);
    this._logger.writeLog(LOG_BASE.ANIME_CACHE_RELOAD, {
      stage: 'start',
      count: 0
    });
    this._images = this._getImgurAlbumImages();
    this._logger.writeLog(LOG_BASE.ANIME_CACHE_RELOAD, {
      stage: 'finish',
      count: this._images.length
    });
    this._imagesToSend = shuffleArray(this._images);
    this._currentImageCount = 0;
  }

  protected _getImgurAlbumImages(): string[] {
    const statement = this._db.prepare(`SELECT source FROM dont_get_attached`);
    const response = statement.all();
    return response.map((item) => {
      return item['source'];
    });
  }

  public getRandomImage(): string {
    if (this._currentImageCount >= this._imagesToSend.length) {
      this._imagesToSend = shuffleArray(this._images);
      this._currentImageCount = 0;
    }

    const imageUrl = this._imagesToSend[this._currentImageCount];
    this._logger.writeLog(LOG_BASE.FETCHED_ANIME_IMAGE, {
      imageUrl: imageUrl
    });
    this._currentImageCount += 1;
    return imageUrl;
  }
}

export { AnimeCache };
