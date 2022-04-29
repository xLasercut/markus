import axios from 'axios'
import {config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'

class AnimeCache {
  protected _images: Array<string>
  protected _imagesToSend: Array<string>

  constructor() {
    this._images = []
    this._imagesToSend = []
  }

  public async startCache(): Promise<any> {
    logger.writeLog(LOG_BASE.CACHE004, {
      stage: 'start',
      count: 0
    })
    this._images = await this._getImgurAlbumImages()
    logger.writeLog(LOG_BASE.CACHE004, {
      stage: 'finish',
      count: this._images.length
    })
    this._imagesToSend = []
  }

  protected async _getImgurAlbumImages(): Promise<Array<string>> {
    if (config.dict.imgurClientId && config.dict.imgurAlbumHash) {
      const url = `https://api.imgur.com/3/album/${config.dict.imgurAlbumHash}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Client-ID ${config.dict.imgurClientId}`
        }
      })

      return response.data.data.images.map(image => image.link)
    }
    return []
  }

  public getRandomImage(): string {
    if (this._imagesToSend.length <= 0) {
      this._imagesToSend = this._images
    }

    const randomIndex = Math.floor(Math.random() * this._imagesToSend.length)
    const imageUrl = this._imagesToSend[randomIndex] || ''
    logger.writeLog(LOG_BASE.CACHE005, {
      imageUrl: imageUrl
    })
    this._imagesToSend.splice(randomIndex, 1)
    return imageUrl
  }
}

export {AnimeCache}
