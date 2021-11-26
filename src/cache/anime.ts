import axios from 'axios'
import {config} from '../app/init'

class AnimeCache {
  protected _images: Array<string>
  protected _imagesSent: Set<string>

  constructor() {
    this._images = []
    this._imagesSent = new Set()
  }

  public async startCache(): Promise<any> {
    this._images = await this._getImgurAlbumImages()
    this._imagesSent = new Set()
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
    const images = this._images
    if (images.length >= this._imagesSent.size) {
      this._imagesSent = new Set()
    }
    while (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length)
      const imageUrl = images[randomIndex]
      if (!this._imagesSent.has(imageUrl)) {
        this._imagesSent.add(imageUrl)
        return imageUrl
      }
      images.splice(randomIndex, 1)
    }
    return ''
  }
}

export {AnimeCache}
