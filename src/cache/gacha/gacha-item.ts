abstract class AbstractGachaItem {
  protected abstract _rarity: number;
  protected _image: string;
  protected _name: string;

  constructor(image: string, name: string) {
    this._image = image;
    this._name = name;
  }

  public get template() {
    return {
      star: new Array(this._rarity).fill('★').join(''),
      rarityClass: `star-${this._rarity}`,
      image: this._image
    };
  }

  public get details() {
    return `[${this._rarity}★] ${this._name}`;
  }

  public get rarity() {
    return this._rarity;
  }
}

class ThreeStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 3;
}

class FourStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 4;
}

class FiveStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 5;
}

export { ThreeStarGachaItem, FiveStarGachaItem, FourStarGachaItem, AbstractGachaItem };
