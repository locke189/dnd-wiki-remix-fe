import {
  authentication,
  createDirectus,
  readMe,
  refresh,
  rest,
  logout,
} from '@directus/sdk';
import { redirect } from '@remix-run/react';
import { commitSession, getSession } from './sessions.server';
import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';

export const Auth = async (request: Request) => {
  const client = createDirectus(
    `${process.env.DB_DOMAIN}:${process.env.DB_PORT}`
  )
    .with(authentication('json'))
    .with(rest());

  const session = await getSession(request.headers.get('Cookie'));

  const clientLogin = async () => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    try {
      // login using the authentication composable
      const result = await client.login(email, password);
      const user = await client.request(
        readMe({
          fields: ['*'],
        })
      );

      session.set('refresh_token', result?.refresh_token);
      session.set('access_token', result?.access_token);
      session.set('userId', user?.id);
      // save expiration time in session = current time + expires_in
      session.set('expires', Date.now() + (result?.expires ?? 0) - 1000);
      console.log('expires in', Date.now() + (result?.expires ?? 0));
      session.unset('error');

      await commitSession(session);

      return redirect('/', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    } catch (error) {
      console.error(error);
      session.flash('error', 'Invalid username/password');

      // Redirect back to the login page with errors.
      return redirect('/login', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    }
  };

  const handleUnauthenticated = () => {
    session.flash('error', 'You must be logged in to access this page');
    session.unset('access_token');
    session.unset('refresh_token');
    session.unset('userId');
    session.unset('expires');
  };

  const setClientToken = async () => {
    const token = session.get('access_token');

    if (!token || token === null) {
      return false;
    }

    await client.setToken(token);
    return true;
  };

  const refreshClientToken = async () => {
    const refreshToken = session.get('refresh_token');

    if (!refreshToken || refreshToken === null) {
      console.log('no refresh token');
      return null;
    }

    try {
      const result = await client.request(refresh('json', refreshToken));
      session.set('refresh_token', result?.refresh_token);
      session.set('access_token', result?.access_token);
      // save expiration time in session = current time + expires_in
      session.set('expires', Date.now() + (result?.expires ?? 0));
      session.unset('error');

      await commitSession(session);
      return true;
    } catch (error) {
      console.error(error);
      await handleUnauthenticated();
      return false;
    }
  };

  const clientLogout = async () => {
    setClientToken();
    const session = await getSession(request.headers.get('Cookie'));
    const refreshToken = session.get('refresh_token');
    console.log('refreshing token', refreshToken);

    if (!refreshToken || refreshToken === null) {
      console.log('no refresh token');
      return null;
    }

    session.unset('access_token');
    session.unset('refresh_token');
    session.unset('userId');
    session.unset('expires');
    session.unset('error');
    try {
      await client.request(logout(refreshToken, 'json'));
      return redirect('/', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    } catch (error) {
      console.error(error);
      return await handleUnauthenticated;
    }
  };

  await setClientToken();

  let user = null;

  try {
    user = await client.request(
      readMe({
        fields: ['*'],
      })
    );
  } catch (error) {
    console.error(error);
    await handleUnauthenticated();
  }

  const getRequestHeaders = async () => ({
    'Set-Cookie': await commitSession(session),
  });

  return {
    isUserLoggedIn: !!user,
    user,
    getRequestHeaders,
    refreshClientToken,
    client: 'request' in client ? client : null,
    session,
    login: clientLogin,
    logout: clientLogout,
  };
};
