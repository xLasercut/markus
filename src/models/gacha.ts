import { z } from 'zod';
import { isValidJson } from './common';
import { shuffleArray } from '../helper';

const DbGachaThreeStarItems = z.object({
  toque: z.number(),
  baseball_cap: z.number(),
  fedora: z.number(),
  straw_hat: z.number(),
  sombrero: z.number()
});

const DbGachaFourStarItems = z.object({
  fez: z.number(),
  top_hat: z.number(),
  ushanka: z.number(),
  ash_cap: z.number()
});

const DbGachaFiveStarItems = z.object({
  cowboy_hat: z.number(),
  space_helm: z.number(),
  helicopter_cap: z.number()
});

const DbGachaSixStarItems = z.object({
  wizard_hat: z.number(),
  link_cap: z.number(),
  gas_mask: z.number()
});

const DbGachaUser = z.object({
  id: z.string().trim().min(1),
  gems: z.number(),
  money_spent: z.number(),
  money_in_bank: z.number(),
  five_star_pity: z.number(),
  four_star_pity: z.number(),
  last_daily_date: z.string().trim().nullable(),
  fabulous_points: z.number()
});

const DbGachaUserStat = DbGachaUser.merge(DbGachaSixStarItems)
  .merge(DbGachaFiveStarItems)
  .merge(DbGachaFourStarItems)
  .merge(DbGachaThreeStarItems);

const DbGachaQuizQuestion = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  choices: z
    .string()
    .trim()
    .min(1)
    .refine((val) => isValidJson(val), { message: 'Invalid json string' })
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.string().trim().min(1)))
    .transform((val) => shuffleArray(val))
});

type TDbGachaUserStat = z.infer<typeof DbGachaUserStat>;
type TDbGachaQuizQuestion = z.infer<typeof DbGachaQuizQuestion>;

export { DbGachaUserStat, DbGachaQuizQuestion };
export type { TDbGachaUserStat, TDbGachaQuizQuestion };
