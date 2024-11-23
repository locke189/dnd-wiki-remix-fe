import { authentication, createDirectus, rest } from '@directus/sdk';

export const client = createDirectus(
  `${process.env.DB_DOMAIN}:${process.env.DB_PORT}`
)
  .with(authentication('json'))
  .with(rest());
