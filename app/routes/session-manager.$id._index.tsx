import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { readItem, updateItem } from '@directus/sdk';

import { SMSessionPage } from '~/pages/sm-session-page';
import { TSession } from '~/types/session';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  const gameSession = await client.request(
    readItem('sessions', id, {
      fields: ['*', 'players.*', 'Npcs.*', 'Locations.*'],
    })
  );

  return json({
    isUserLoggedIn: true,
    gameSession,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const body = await request.formData();
  const { id } = params;

  if (!id) {
    return redirect('/');
  }

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(
    updateItem('sessions', id, data as object)
  );

  return json({ data: gameSession });
}

export default function Index() {
  const { id } = useParams();
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    gameSession: TSession;
  }>();

  const { gameSession } = data || {};

  return (
    // navbar
    <SMSessionPage gameSession={gameSession} key={id} />
  );
}
