import {
  FiveStarGachaItem,
  FourStarGachaItem,
  SixStarGachaItem,
  ThreeStarGachaItem
} from './gacha-item';

const THREE_STARS = [
  new ThreeStarGachaItem('toque', 'Eggless Omelette'),
  new ThreeStarGachaItem('baseball_cap', 'Home Run'),
  new ThreeStarGachaItem('fedora', "M'Lady"),
  new ThreeStarGachaItem('straw_hat', 'Beach Episode'),
  new ThreeStarGachaItem('sombrero', 'UNO!')
];

const FOUR_STARS = [
  new FourStarGachaItem('fez', 'Are Cool'),
  new FourStarGachaItem('top_hat', "Bo'ohw'oWa'er"),
  new FourStarGachaItem('ushanka', 'Союз'),
  new FourStarGachaItem('ash_cap', '10 Years Old')
];

const FIVE_STARS = [
  new FiveStarGachaItem('cowboy_hat', 'Yeehaw!'),
  new FiveStarGachaItem('space_helm', 'Hey, who turned out the lights?'),
  new FiveStarGachaItem('helicopter_cap', '+15 Defence')
];

const SIX_STARS = [
  new SixStarGachaItem('wizard_hat', 'Snape, Snape, Severus Snape'),
  new SixStarGachaItem('link_cap', 'The Legend of "Zelda"'),
  new SixStarGachaItem('gas_mask', 'Are you my mummy?')
];

const FIVE_STAR_PITY = 90;

export { THREE_STARS, FOUR_STARS, FIVE_STARS, SIX_STARS, FIVE_STAR_PITY };
