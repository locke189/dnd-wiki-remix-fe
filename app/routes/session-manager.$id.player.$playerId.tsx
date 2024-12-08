import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { readItem, readItems, updateItem } from '@directus/sdk';

import { TPlayer } from '~/types/player';
import { getImageUrl } from '~/lib/utils';
import { TSession } from '~/types/session';
import { TNpc } from '~/types/npc';
import { authenticator } from '~/lib/authentication.server';
import { client } from '~/lib/directus.server';
import { TBastion } from '~/types/bastion';
import { SMPlayerPage } from '~/pages/sm-players-page';

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

  const { playerId } = params;

  if (!playerId) {
    return redirect('/');
  }

  const player = await client.request(
    readItem('Player', playerId, {
      fields: [
        '*',
        'campaigns.*',
        'Allied_npcs.*',
        'sessions.*',
        'bastions.*',
        'Parties.*',
        'Spells.*',
        'items.*',
      ],
    })
  );

  const sessions = await client.request(
    readItems('sessions', { fields: ['id', 'name', 'date', 'campaign'] })
  );

  return json({
    isUserLoggedIn: true,
    player: {
      ...player,
      main_image: getImageUrl(player.main_image),
      bastions: player.bastions.map((b: TBastion) => ({
        ...b,
        main_image: getImageUrl(b.main_image),
      })),
    },
    sessions,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  client.setToken(user?.token);

  const body = await request.formData();
  const { id: playerId } = params;

  if (!playerId) {
    return redirect('/login');
  }

  const data = JSON.parse(String(body.get('data')));

  const gameSession = await client.request(
    updateItem('Player', playerId, data as object)
  );

  return json({ data: gameSession });
}

export default function Index() {
  const data = useLoaderData<{
    isUserLoggedIn: boolean;
    player: TPlayer;
    sessions: TSession[];
    npcs: TNpc[];
  } | null>();

  const { playerId } = useParams();

  const { player } = data || {};

  return (
    // navbar
    <>
      <SMPlayerPage player={player} key={playerId} />
    </>
  );
}
