// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { TUser } from '~/types/user';
import { sessionStorage } from './session.server';
import { FormStrategy } from 'remix-auth-form';
import { client } from './directus.server';
import { readMe } from '@directus/sdk';

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<TUser>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    const result = await client.login(email, password);
    const user = await client.request(
      readMe({
        fields: ['*'],
      })
    );

    return {
      token: result.access_token ?? '',
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-pass'
);
