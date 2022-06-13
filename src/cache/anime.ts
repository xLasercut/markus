import axios from 'axios'
import { config, logger } from '../app/init'
import { LOG_BASE } from '../app/logging'

class AnimeCache {
  protected _images: Array<string>
  protected _imagesToSend: Array<string>
  protected _currentImageCount: number

  constructor() {
    this._images = []
    this._imagesToSend = []
    this._currentImageCount = 0
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
    this._imagesToSend = this._shuffleArray(this._images)
    this._currentImageCount = 0
  }

  protected async _getImgurAlbumImages(): Promise<Array<string>> {
    if (config.dict.imgurClientId && config.dict.imgurAlbumHash) {
      const url = `https://api.imgur.com/3/album/${config.dict.imgurAlbumHash}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Client-ID ${config.dict.imgurClientId}`
        }
      })

      return response.data.data.images.map((image) => image.link)
    }
    return []
  }

  public getRandomImage(): string {
    if (this._currentImageCount >= this._imagesToSend.length) {
      this._imagesToSend = this._shuffleArray(this._images)
      this._currentImageCount = 0
    }

    const imageUrl = this._imagesToSend[this._currentImageCount]
    logger.writeLog(LOG_BASE.CACHE005, {
      imageUrl: imageUrl
    })
    this._currentImageCount += 1
    return imageUrl
  }

  protected _shuffleArray(array: string[]): string[] {
    const shuffledList = [...array]
    let currentIndex = shuffledList.length,
      randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[shuffledList[currentIndex], shuffledList[randomIndex]] = [
        shuffledList[randomIndex],
        shuffledList[currentIndex]
      ]
    }
    return shuffledList
  }
}

export { AnimeCache }
