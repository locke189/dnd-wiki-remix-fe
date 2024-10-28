// app/sessions.ts
import { createCookieSessionStorage } from '@remix-run/node'; // or cloudflare/deno

type SessionData = {
  expires?: number | null;
  refresh_token?: string | null;
  access_token?: string | null;
  userId?: string | null;
  error?: string | null;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: '__session',

      // all of these are optional
      // domain: 'remix.run',
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      domain: process.env.SESSION_DOMAIN ?? 'localhost',
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET ?? 's3-cr3t'],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
