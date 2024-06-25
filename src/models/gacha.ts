import { z } from 'zod';

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
  last_daily_date: z.string().trim().nullable()
});

const DbGachaUserStat = DbGachaUser.merge(DbGachaSixStarItems)
  .merge(DbGachaFiveStarItems)
  .merge(DbGachaFourStarItems)
  .merge(DbGachaThreeStarItems);

type TDbGachaUserStat = z.infer<typeof DbGachaUserStat>;

export { DbGachaUserStat };
export type { TDbGachaUserStat };
