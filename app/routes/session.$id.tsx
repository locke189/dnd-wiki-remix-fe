import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { Auth } from '~/lib/auth.server';
import { readItem, readItems, updateItem } from '@directus/sdk';
import { commitSession } from '~/lib/sessions.server';

import { SessionPage } from '~/pages/session-page';
import { getImageUrl } from '~/lib/utils';
import { TSession } from '~/types/session';
import { TPlayer } from '~/types/player';

export const meta: MetaFunction = () => {
  return [
    { title: 'The Realm Record' },
    { name: 'description', content: 'Welcome!' },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  const { id } = params;

  if (!isUserLoggedIn || client === null || !id) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const gameSession = await client.request(
    readItem('sessions', id, {
      fields: ['*', 'players.*'],
    })
  );

  const players = await client.request(
    readItems('Player', {
      fields: ['*', 'campaigns.*'],
    })
  );

  return json(
    {
      isUserLoggedIn: true,
      gameSession,
      players: players.map((player) => ({
        ...player,
        main_image: getImageUrl(player.main_image),
      })),
    },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, isUserLoggedIn, getRequestHeaders, session } = await Auth(
    request
  );

  const body = await request.formData();
  const { id } = params;

  if (!isUserLoggedIn || client === null || !id) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const data = JSON.parse(String(body.get('data')));
  console.log(data);

  const gameSession = await client.request(
    updateItem('sessions', id, data as object)
  );

  console.log(gameSession);

  return json(
    { data: 'Action Triggered' },
    {
      headers: {
        ...(await getRequestHeaders()),
      },
    }
  );
}

export default function Index() {
  const { id } = useParams();
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    gameSession: TSession;
    players?: TPlayer[];
  }>();

  const { gameSession, players } = data || {};
  return (
    // navbar
    <SessionPage gameSession={gameSession} key={id} players={players} />
  );
}
