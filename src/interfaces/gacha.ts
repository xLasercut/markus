import { AbstractGachaItem } from '../cache/gacha/gacha-item';

interface TDoTenRollResponse {
  fiveStarPity: number;
  items: AbstractGachaItem[];
}

export type { TDoTenRollResponse };
