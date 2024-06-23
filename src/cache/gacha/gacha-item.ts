abstract class AbstractGachaItem {
  protected abstract _rarity: number;
  protected _image: string;
  protected _name: string;

  constructor(image: string, name: string) {
    this._image = image;
    this._name = name;
  }

  protected _getStars(): string {
    if (this._rarity > 5) {
      return (
        new Array(this._rarity - 5).fill('★').join('') + '\n' + new Array(5).fill('★').join('')
      );
    }

    return new Array(this._rarity).fill('★').join('');
  }

  public get template() {
    return {
      star: this._getStars(),
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

class SixStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 6;
}

export {
  ThreeStarGachaItem,
  FiveStarGachaItem,
  FourStarGachaItem,
  AbstractGachaItem,
  SixStarGachaItem
};
