import { z } from 'zod';

const ItemType = z.union([z.literal('S>'), z.literal('B>')]);

const Id = z.union([z.string().trim(), z.number()]).pipe(z.coerce.string());

const Item = z.object({
  id: Id,
  server: z.string().trim(),
  type: ItemType,
  state: z.string().trim(),
  item_id: Id,
  name: z.string().trim(),
  rarity: z.string().trim(),
  slot: z.string().trim(),
  category: z.string().trim(),
  character: z.string().trim(),
  detail: z.string().trim(),
  price: z.string().trim(),
  contact_discord: z.string().trim(),
  displayname: z.string().trim(),
  usercode: z.string().trim(),
  discord_id: z.string().trim(),
  user_id: Id
});

const UserItem = z.object({
  id: Id,
  state: z.string().trim(),
  type: ItemType
});

const UserItemApiResponse = z.object({
  users: z.record(Id, z.array(UserItem))
});

const ItemApiResponse = z.object({
  posts: z.array(Item)
});

const ImgchestApiResponse = z.object({
  data: z.object({
    images: z.array(
      z.object({
        link: z.string().trim()
      })
    )
  })
});

export { Item, ItemApiResponse, UserItemApiResponse, UserItem, ImgchestApiResponse };
